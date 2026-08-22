/**
 * Self-contained production server. It serves the Vite build and the shop API
 * from one process, so local development and Render use the same command.
 */
import http from 'node:http';
import { randomUUID, scryptSync } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync, createReadStream } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || join(root, 'data');
const dbFile = join(dataDir, 'store.json');
const distDir = join(root, 'dist');
const requestedPort = Number(process.env.PORT || 3000);
const hasPlatformPort = Boolean(process.env.PORT);
const sessions = new Map();

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const seedProducts = [
  ['kashmiri-saffron', 'Kashmiri Saffron', 'saffron', 799, 999, '1 g', '/images/saffron.png', 'Handpicked Kashmiri kesar with a rich aroma and deep natural colour.'],
  ['pure-shilajit', 'Pure Himalayan Shilajit', 'shilajit', 1199, 1499, '20 g', '/images/shilajit.png', 'Purified Himalayan shilajit resin for your everyday wellness routine.'],
  ['premium-walnuts', 'Premium Kashmiri Walnuts', 'dry-fruits', 499, 599, '500 g', '/images/walnuts.png', 'Naturally crunchy, premium walnut kernels from Kashmir.'],
  ['almond-giri', 'California Almond Giri', 'dry-fruits', 549, 649, '500 g', '/images/almond-giri.png', 'Fresh, wholesome almonds selected for taste and quality.'],
  ['saffron-face-wash', 'Saffron Face Wash', 'skincare', 299, 349, '100 ml', '/images/face-wash.png', 'A gentle saffron-enriched face wash for a fresh daily cleanse.'],
  ['saffron-face-cream', 'Saffron Face Cream', 'skincare', 399, 499, '50 g', '/images/face-cream.png', 'Nourishing face cream with the warmth of saffron.'],
].map(([slug, name, category, price, mrp, size, image, description], i) => ({
  id: String(i + 1),
  slug,
  name,
  category,
  price,
  mrp,
  discount: Math.round((1 - price / mrp) * 100),
  size,
  image,
  images: [image],
  description,
  isAvailable: true,
}));

const defaults = () => ({
  settings: {
    storeName: 'Daljheel Food Mart',
    tagline: 'The Power of Purity',
    supportEmail: 'daljheelfoodmart@gmail.com',
    supportPhone: '8899047015',
    whatsappDigits: '918899047015',
    freeShippingThreshold: 999,
    flatShipping: 79,
    shippingCarriers: ['Delhivery', 'DTDC', 'India Post'],
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  },
  users: [
    {
      id: 'admin-1',
      name: 'Store Admin',
      email: 'admin@daljheel.com',
      phone: '',
      role: 'admin',
      password: hash('admin123'),
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  carts: {},
  wishlists: {},
  addresses: {},
  orders: [],
  products: seedProducts,
});

function hash(value) {
  const salt = 'daljheel-store-v1';
  return scryptSync(value, salt, 32).toString('hex');
}

function load() {
  try {
    return JSON.parse(readFileSync(dbFile, 'utf8'));
  } catch {
    const value = defaults();
    save(value);
    return value;
  }
}

let db = load();
if (!Array.isArray(db.products)) {
  db.products = seedProducts;
  save();
}

function save(value = db) {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(dbFile, JSON.stringify(value, null, 2));
}

function safeUser(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}

function respond(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
}

function error(res, status, message) {
  respond(res, status, { error: message });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) reject(new Error('Request too large'));
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function auth(req, admin = false) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const user = sessions.get(token);
  if (!user) return null;
  // Always resolve from DB so updates (password, profile, isActive) stay live
  const fresh = db.users.find((u) => u.id === user.id) || user;
  if (!fresh.isActive) return null;
  if (admin && fresh.role !== 'admin') return null;
  sessions.set(token, fresh);
  return fresh;
}

function findProduct(slug) {
  return db.products.find((p) => p.slug === slug);
}

function productPayload(input, current = {}) {
  const name = String(input.name ?? current.name ?? '').trim();
  const slug = String(input.slug ?? current.slug ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const price = Number(input.price ?? current.price ?? 0);
  const mrp = Number(input.mrp ?? current.mrp ?? price);
  if (!name || !slug || !Number.isFinite(price) || price < 0 || !Number.isFinite(mrp) || mrp < 0) {
    throw new Error('Name, slug, price and MRP are required.');
  }
  const image = String(input.image ?? current.image ?? '/images/saffron.png').trim();
  const images = Array.isArray(input.images) && input.images.length
    ? input.images
    : input.image !== undefined
      ? [image]
      : current.images || [image];
  return {
    ...current,
    name,
    slug,
    category: String(input.category ?? current.category ?? 'dry-fruits').trim(),
    price,
    mrp,
    discount: mrp > price ? Math.round((1 - price / mrp) * 100) : 0,
    size: String(input.size ?? current.size ?? '').trim(),
    image,
    images: images.map(String),
    description: String(input.description ?? current.description ?? '').trim(),
    isAvailable: input.isAvailable ?? current.isAvailable ?? true,
  };
}

function cartFor(userId) {
  const rows = db.carts[userId] || [];
  const items = rows
    .map(({ slug, qty }) => {
      const p = findProduct(slug);
      if (!p) return null;
      return {
        ...p,
        qty,
        lineTotal: p.price * qty,
        lineDiscount: (p.mrp - p.price) * qty,
      };
    })
    .filter(Boolean);
  const subtotal = items.reduce((n, x) => n + x.lineTotal, 0);
  const mrpTotal = items.reduce((n, x) => n + x.mrp * x.qty, 0);
  const shipping =
    !items.length || subtotal >= db.settings.freeShippingThreshold ? 0 : db.settings.flatShipping;
  return {
    items,
    subtotal,
    mrpTotal,
    discount: mrpTotal - subtotal,
    shipping,
    freeShippingThreshold: db.settings.freeShippingThreshold,
    total: subtotal + shipping,
  };
}

function wishlistPayload(userId) {
  const slugs = db.wishlists[userId] || [];
  return {
    items: slugs
      .map((slug) => {
        const product = findProduct(slug);
        return product ? { slug, product } : null;
      })
      .filter(Boolean),
  };
}

function formatAddress(addr) {
  if (!addr) return '';
  if (addr.address) return addr.address;
  return [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');
}

function issue(user) {
  const token = randomUUID();
  sessions.set(token, user);
  return { token, user: safeUser(user) };
}

function nextOrderCode() {
  return `DFM-${1001 + db.orders.length}`;
}

function userOrders(userId) {
  return db.orders.filter((o) => o.userId === userId);
}

function filterOrders(list, { q, status } = {}) {
  let result = list;
  if (status && status !== 'all') {
    result = result.filter((o) => o.status === status);
  }
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((o) => {
      const hay = [
        o.orderCode,
        o.customer?.name,
        o.customer?.phone,
        o.customer?.address,
        o.shippingInfo?.trackingNumber,
        o.shippingInfo?.carrier,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }
  return result;
}

async function createOrder(req, res, user) {
  const b = await readBody(req);
  const lines = (b.items || [])
    .map((x) => ({ product: findProduct(x.slug), qty: Math.max(1, Number(x.qty) || 1) }))
    .filter((x) => x.product);
  if (!lines.length) return error(res, 400, 'Your cart is empty');

  const saved =
    user && b.addressId ? (db.addresses[user.id] || []).find((a) => a.id === b.addressId) : null;

  let customer;
  if (saved) {
    customer = {
      name: saved.name,
      phone: saved.phone,
      address: formatAddress(saved),
      note: b.customer?.note || '',
      addressId: saved.id,
    };
  } else {
    customer = b.customer || {};
  }

  if (!customer?.name || !customer?.phone || !customer?.address) {
    return error(res, 400, 'Delivery name, phone and address are required');
  }

  const subtotal = lines.reduce((n, x) => n + x.product.price * x.qty, 0);
  const mrpTotal = lines.reduce((n, x) => n + x.product.mrp * x.qty, 0);
  const shipping = subtotal >= db.settings.freeShippingThreshold ? 0 : db.settings.flatShipping;
  const paymentLabels = {
    whatsapp: 'Confirm on WhatsApp',
    cod: 'Cash on delivery',
    upi: 'UPI',
  };

  const order = {
    id: randomUUID(),
    orderCode: nextOrderCode(),
    userId: user?.id || null,
    customer,
    items: lines.map((x) => ({
      ...x.product,
      qty: x.qty,
      lineTotal: x.product.price * x.qty,
    })),
    subtotal,
    discount: mrpTotal - subtotal,
    shipping,
    total: subtotal + shipping,
    paymentMethod: b.paymentMethod || 'whatsapp',
    paymentLabel: paymentLabels[b.paymentMethod] || paymentLabels.whatsapp,
    status: 'Pending',
    adminNote: '',
    shippingInfo: {
      carrier: '',
      trackingNumber: '',
      estimatedDelivery: '',
      notes: '',
    },
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(order);
  if (user) db.carts[user.id] = [];
  save();

  const text = encodeURIComponent(
    `Hello, I want to confirm order ${order.orderCode} for ₹${order.total}.`
  );
  return respond(res, 201, {
    order,
    whatsappUrl: `https://wa.me/${db.settings.whatsappDigits}?text=${text}`,
  });
}

async function api(req, res, url) {
  const path = url.pathname.slice(4) || '/';
  const method = req.method;

  if (path === '/health') return respond(res, 200, { ok: true });

  if (method === 'GET' && path === '/content') {
    return respond(res, 200, {
      businessName: db.settings.storeName,
      tagline: db.settings.tagline,
      whatsappDigits: db.settings.whatsappDigits,
      whatsapp: db.settings.supportPhone,
      phone: db.settings.supportPhone,
      email: db.settings.supportEmail,
      instagram: '@daljheelfoodmart',
      instagramUrl: 'https://www.instagram.com/',
      mapUrl: 'https://maps.google.com/',
      address: { line1: 'Daljheel Food Mart', line2: 'Kashmir, India', line3: '' },
      philosophy: ['Pure ingredients', 'Thoughtfully sourced', 'Made for everyday wellness'],
      shippingNote: `Free shipping above ₹${db.settings.freeShippingThreshold}.`,
    });
  }

  if (method === 'GET' && path === '/categories') {
    return respond(res, 200, [
      { slug: 'saffron', name: 'Saffron', image: '/images/banner-saffron.png' },
      { slug: 'shilajit', name: 'Shilajit', image: '/images/banner-shilajit.png' },
      { slug: 'dry-fruits', name: 'Dry Fruits', image: '/images/banner-walnuts.png' },
      { slug: 'skincare', name: 'Skincare', image: '/images/face-cream.png' },
    ]);
  }

  if (method === 'GET' && path === '/banners') {
    return respond(res, 200, [
      {
        id: '1',
        title: 'Pure Kashmiri goodness',
        subtitle: 'Premium quality delivered to your door',
        image: '/images/banner-saffron.png',
        link: '/shop',
      },
    ]);
  }

  if (method === 'GET' && path === '/social-links') {
    return respond(res, 200, {
      instagram: 'https://www.instagram.com/',
      whatsapp: `https://wa.me/${db.settings.whatsappDigits}`,
    });
  }

  if (method === 'GET' && path === '/products') {
    const category = url.searchParams.get('category');
    const query = (url.searchParams.get('search') || '').toLowerCase();
    return respond(
      res,
      200,
      db.products.filter(
        (p) =>
          (!category || p.category === category) &&
          (!query || `${p.name} ${p.description}`.toLowerCase().includes(query))
      )
    );
  }

  if (method === 'GET' && path.startsWith('/products/')) {
    const p = findProduct(decodeURIComponent(path.slice(10)));
    return p ? respond(res, 200, p) : error(res, 404, 'Product not found');
  }

  if (method === 'POST' && path === '/auth/register') {
    const b = await readBody(req);
    if (!b.name || !b.email || !b.password || b.password.length < 6) {
      return error(res, 400, 'Name, email and a 6-character password are required');
    }
    if (db.users.some((u) => u.email.toLowerCase() === b.email.toLowerCase())) {
      return error(res, 409, 'An account already exists with this email');
    }
    const user = {
      id: randomUUID(),
      name: b.name.trim(),
      email: b.email.trim().toLowerCase(),
      phone: b.phone || '',
      role: 'customer',
      password: hash(b.password),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    save();
    return respond(res, 201, issue(user));
  }

  if (method === 'POST' && (path === '/auth/login' || path === '/admin/login')) {
    const b = await readBody(req);
    const user = db.users.find((u) => u.email.toLowerCase() === String(b.email || '').toLowerCase());
    if (
      !user ||
      user.password !== hash(b.password || '') ||
      !user.isActive ||
      (path === '/admin/login' && user.role !== 'admin')
    ) {
      return error(res, 401, 'Invalid email or password');
    }
    return respond(res, 200, issue(user));
  }

  if (method === 'GET' && path === '/auth/me') {
    const user = auth(req);
    return user ? respond(res, 200, { user: safeUser(user) }) : error(res, 401, 'Please sign in');
  }

  if (method === 'POST' && path === '/auth/logout') {
    sessions.delete((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
    return respond(res, 200, { ok: true });
  }

  // Admin routes (except login handled above)
  if (path.startsWith('/admin')) {
    const parsed = method === 'GET' || method === 'HEAD' ? {} : await readBody(req).catch(() => ({}));
    return adminApi(req, res, url, path, method, parsed);
  }

  const user = auth(req);

  // Guest checkout allowed for POST /orders
  if (method === 'POST' && path === '/orders') {
    return createOrder(req, res, user);
  }

  if (!user) return error(res, 401, 'Please sign in');

  if (method === 'GET' && path === '/users/profile') {
    return respond(res, 200, { user: safeUser(user) });
  }

  if (method === 'PUT' && path === '/users/profile') {
    const b = await readBody(req);
    Object.assign(user, {
      name: b.name?.trim() || user.name,
      phone: b.phone ?? user.phone,
      email: b.email?.trim()?.toLowerCase() || user.email,
    });
    save();
    return respond(res, 200, { user: safeUser(user) });
  }

  if (path === '/users/avatar') {
    return error(res, 501, 'Avatar uploads need external object storage before production use');
  }

  if (method === 'GET' && path === '/users/dashboard') {
    const orders = userOrders(user.id);
    const addresses = db.addresses[user.id] || [];
    const cart = db.carts[user.id] || [];
    const wishlist = db.wishlists[user.id] || [];
    return respond(res, 200, {
      stats: {
        orders: orders.length,
        wishlist: wishlist.length,
        cart: cart.reduce((n, x) => n + (x.qty || 0), 0),
        addresses: addresses.length,
      },
      recentOrders: orders.slice(0, 5).map((o) => ({
        orderCode: o.orderCode,
        createdAt: o.createdAt,
        itemCount: o.items?.length || 0,
        total: o.total,
        status: o.status,
      })),
    });
  }

  if (method === 'GET' && path === '/cart') {
    return respond(res, 200, cartFor(user.id));
  }

  if (method === 'POST' && path === '/cart') {
    const b = await readBody(req);
    if (!findProduct(b.slug)) return error(res, 404, 'Product not found');
    const cart = (db.carts[user.id] ||= []);
    const row = cart.find((x) => x.slug === b.slug);
    const qty = Math.max(1, Number(b.qty) || 1);
    if (row) row.qty += qty;
    else cart.push({ slug: b.slug, qty });
    save();
    return respond(res, 200, cartFor(user.id));
  }

  if (method === 'POST' && path === '/cart/merge') {
    const b = await readBody(req);
    const cart = (db.carts[user.id] ||= []);
    for (const item of b.items || []) {
      if (!findProduct(item.slug)) continue;
      const qty = Math.max(1, Number(item.qty) || 1);
      const row = cart.find((x) => x.slug === item.slug);
      if (row) row.qty += qty;
      else cart.push({ slug: item.slug, qty });
    }
    save();
    return respond(res, 200, cartFor(user.id));
  }

  if (method === 'DELETE' && path === '/cart') {
    db.carts[user.id] = [];
    save();
    return respond(res, 200, cartFor(user.id));
  }

  if (path.startsWith('/cart/')) {
    const slug = decodeURIComponent(path.slice(6));
    const cart = (db.carts[user.id] ||= []);
    if (method === 'PUT') {
      const b = await readBody(req);
      const row = cart.find((x) => x.slug === slug);
      if (row) row.qty = Number(b.qty);
      db.carts[user.id] = cart.filter((x) => x.qty > 0);
      save();
      return respond(res, 200, cartFor(user.id));
    }
    if (method === 'DELETE') {
      db.carts[user.id] = cart.filter((x) => x.slug !== slug);
      save();
      return respond(res, 200, cartFor(user.id));
    }
  }

  if (method === 'GET' && path === '/wishlist') {
    return respond(res, 200, wishlistPayload(user.id));
  }

  if (method === 'POST' && path === '/wishlist') {
    const b = await readBody(req);
    if (!findProduct(b.slug)) return error(res, 404, 'Product not found');
    const list = (db.wishlists[user.id] ||= []);
    if (!list.includes(b.slug)) list.push(b.slug);
    save();
    return respond(res, 200, wishlistPayload(user.id));
  }

  if (method === 'POST' && path === '/wishlist/move-to-cart') {
    const b = await readBody(req);
    const list = (db.wishlists[user.id] ||= []);
    if (!list.includes(b.slug)) return error(res, 404, 'Item not in wishlist');
    if (!findProduct(b.slug)) return error(res, 404, 'Product not found');
    db.wishlists[user.id] = list.filter((x) => x !== b.slug);
    const cart = (db.carts[user.id] ||= []);
    const row = cart.find((x) => x.slug === b.slug);
    if (row) row.qty += 1;
    else cart.push({ slug: b.slug, qty: 1 });
    save();
    return respond(res, 200, {
      wishlist: wishlistPayload(user.id),
      cart: cartFor(user.id),
    });
  }

  if (path.startsWith('/wishlist/') && method === 'DELETE') {
    const slug = decodeURIComponent(path.slice(10));
    db.wishlists[user.id] = (db.wishlists[user.id] || []).filter((x) => x !== slug);
    save();
    return respond(res, 200, wishlistPayload(user.id));
  }

  if (method === 'GET' && path === '/addresses') {
    return respond(res, 200, db.addresses[user.id] || []);
  }

  if (method === 'POST' && path === '/addresses') {
    const b = await readBody(req);
    const list = (db.addresses[user.id] ||= []);
    const address = {
      id: randomUUID(),
      label: b.label || 'Home',
      name: b.name || '',
      phone: b.phone || '',
      line1: b.line1 || '',
      line2: b.line2 || '',
      city: b.city || '',
      state: b.state || '',
      pincode: b.pincode || '',
      isDefault: !list.length || Boolean(b.isDefault),
    };
    if (address.isDefault) list.forEach((a) => (a.isDefault = false));
    list.push(address);
    save();
    return respond(res, 201, address);
  }

  if (path.startsWith('/addresses/')) {
    const rest = path.slice('/addresses/'.length);
    const isDefault = rest.endsWith('/default');
    const id = decodeURIComponent(isDefault ? rest.slice(0, -'/default'.length) : rest);
    const list = (db.addresses[user.id] ||= []);
    const idx = list.findIndex((a) => a.id === id);
    if (idx < 0) return error(res, 404, 'Address not found');

    if (method === 'POST' && isDefault) {
      list.forEach((a) => (a.isDefault = a.id === id));
      save();
      return respond(res, 200, list[idx]);
    }

    if (method === 'PUT' && !isDefault) {
      const b = await readBody(req);
      const current = list[idx];
      Object.assign(current, {
        label: b.label ?? current.label,
        name: b.name ?? current.name,
        phone: b.phone ?? current.phone,
        line1: b.line1 ?? current.line1,
        line2: b.line2 ?? current.line2,
        city: b.city ?? current.city,
        state: b.state ?? current.state,
        pincode: b.pincode ?? current.pincode,
      });
      if (b.isDefault) list.forEach((a) => (a.isDefault = a.id === id));
      save();
      return respond(res, 200, current);
    }

    if (method === 'DELETE' && !isDefault) {
      const wasDefault = list[idx].isDefault;
      list.splice(idx, 1);
      if (wasDefault && list[0]) list[0].isDefault = true;
      save();
      return respond(res, 200, { ok: true });
    }
  }

  if (method === 'GET' && path === '/orders/mine') {
    return respond(res, 200, { orders: userOrders(user.id) });
  }

  if (method === 'GET' && path.startsWith('/orders/')) {
    const code = decodeURIComponent(path.slice('/orders/'.length));
    const order = db.orders.find((x) => x.orderCode === code);
    if (!order || (order.userId !== user.id && user.role !== 'admin')) {
      return error(res, 404, 'Order not found');
    }
    return respond(res, 200, { order });
  }

  return error(res, 404, 'API route not found');
}

function adminApi(req, res, url, path, method, parsed) {
  const user = auth(req, true);
  if (!user) return error(res, 401, 'Admin access required');

  const orders = db.orders;

  if (method === 'GET' && path === '/admin/dashboard') {
    const status = ORDER_STATUSES;
    const dayMap = new Map();
    for (let i = 0; i < 30; i += 1) {
      const date = new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10);
      dayMap.set(date, { date, revenue: 0, orders: 0 });
    }
    for (const o of orders) {
      const date = (o.createdAt || '').slice(0, 10);
      if (dayMap.has(date)) {
        const row = dayMap.get(date);
        row.revenue += o.total || 0;
        row.orders += 1;
      }
    }
    return respond(res, 200, {
      stats: {
        revenue: orders.reduce((n, o) => n + (o.total || 0), 0),
        orders: orders.length,
        users: db.users.filter((x) => x.role === 'customer').length,
        pendingOrders: orders.filter((x) => x.status === 'Pending').length,
        activeCartItems: Object.values(db.carts).flat().reduce((n, x) => n + (x.qty || 0), 0),
        wishlistItems: Object.values(db.wishlists).flat().length,
      },
      statusBreakdown: status.map((s) => ({
        status: s,
        count: orders.filter((o) => o.status === s).length,
      })),
      salesChart: [...dayMap.values()],
      recentOrders: orders.slice(0, 8),
      recentUsers: db.users
        .filter((x) => x.role === 'customer')
        .slice(-8)
        .reverse()
        .map(safeUser),
      recentActivity: orders.slice(0, 8).map((o) => ({
        type: 'order',
        ref: o.orderCode,
        label: `Order ${o.orderCode} placed`,
        at: o.createdAt,
      })),
    });
  }

  if (method === 'GET' && path === '/admin/products') {
    return respond(res, 200, { products: db.products });
  }

  if (method === 'POST' && path === '/admin/products') {
    try {
      const product = productPayload(parsed);
      if (findProduct(product.slug)) return error(res, 409, 'A product with this slug already exists');
      product.id = randomUUID();
      db.products.push(product);
      save();
      return respond(res, 201, { product });
    } catch (err) {
      return error(res, 400, err.message);
    }
  }

  if (method === 'PUT' && path.startsWith('/admin/products/')) {
    const slug = decodeURIComponent(path.slice('/admin/products/'.length));
    const product = findProduct(slug);
    if (!product) return error(res, 404, 'Product not found');
    try {
      const updated = productPayload(parsed, product);
      if (updated.slug !== slug && findProduct(updated.slug)) return error(res, 409, 'A product with this slug already exists');
      Object.assign(product, updated);
      save();
      return respond(res, 200, { product });
    } catch (err) {
      return error(res, 400, err.message);
    }
  }

  if (method === 'DELETE' && path.startsWith('/admin/products/')) {
    const slug = decodeURIComponent(path.slice('/admin/products/'.length));
    const index = db.products.findIndex((p) => p.slug === slug);
    if (index < 0) return error(res, 404, 'Product not found');
    const [product] = db.products.splice(index, 1);
    Object.keys(db.carts).forEach((userId) => {
      db.carts[userId] = (db.carts[userId] || []).filter((item) => item.slug !== slug);
    });
    Object.keys(db.wishlists).forEach((userId) => {
      db.wishlists[userId] = (db.wishlists[userId] || []).filter((itemSlug) => itemSlug !== slug);
    });
    save();
    return respond(res, 200, { product });
  }

  if (method === 'GET' && path === '/admin/orders') {
    const q = url.searchParams.get('q') || '';
    const status = url.searchParams.get('status') || 'all';
    return respond(res, 200, {
      orders: filterOrders(orders, { q, status }),
      statuses: ORDER_STATUSES,
    });
  }

  if (method === 'GET' && path.startsWith('/admin/orders/')) {
    const code = decodeURIComponent(path.slice('/admin/orders/'.length));
    const order = orders.find((o) => o.orderCode === code);
    if (!order) return error(res, 404, 'Order not found');
    const customer = order.userId ? db.users.find((u) => u.id === order.userId) : null;
    return respond(res, 200, {
      order,
      user: customer ? safeUser(customer) : null,
      statuses: ORDER_STATUSES,
    });
  }

  if (method === 'PATCH' && path.startsWith('/admin/orders/')) {
    const code = decodeURIComponent(path.slice('/admin/orders/'.length));
    const order = orders.find((o) => o.orderCode === code);
    if (!order) return error(res, 404, 'Order not found');
    Object.assign(order, {
      status: parsed.status || order.status,
      adminNote: parsed.adminNote ?? order.adminNote,
    });
    save();
    return respond(res, 200, { order });
  }

  if (method === 'GET' && path === '/admin/users') {
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const status = url.searchParams.get('status') || 'all';
    let users = db.users.filter((x) => x.role === 'customer');
    if (status === 'active') users = users.filter((u) => u.isActive !== false);
    if (status === 'inactive') users = users.filter((u) => u.isActive === false);
    if (q) {
      users = users.filter((u) =>
        `${u.name} ${u.email} ${u.phone || ''}`.toLowerCase().includes(q)
      );
    }
    return respond(res, 200, {
      users: users.map((u) => {
        const uOrders = userOrders(u.id);
        return {
          ...safeUser(u),
          orderCount: uOrders.length,
          totalSpent: uOrders.reduce((n, o) => n + (o.total || 0), 0),
        };
      }),
    });
  }

  if (method === 'GET' && path.startsWith('/admin/users/')) {
    const id = decodeURIComponent(path.slice('/admin/users/'.length));
    const target = db.users.find((u) => u.id === id && u.role === 'customer');
    if (!target) return error(res, 404, 'User not found');
    const uOrders = userOrders(target.id);
    return respond(res, 200, {
      user: safeUser(target),
      orders: uOrders,
      addresses: db.addresses[target.id] || [],
      stats: {
        orderCount: uOrders.length,
        totalSpent: uOrders.reduce((n, o) => n + (o.total || 0), 0),
      },
      cartItems: cartFor(target.id).items,
      wishlistItems: wishlistPayload(target.id).items,
    });
  }

  if (method === 'PATCH' && path.startsWith('/admin/users/')) {
    const id = decodeURIComponent(path.slice('/admin/users/'.length));
    const target = db.users.find((u) => u.id === id && u.role === 'customer');
    if (!target) return error(res, 404, 'User not found');
    if (parsed.name !== undefined) target.name = String(parsed.name).trim() || target.name;
    if (parsed.email !== undefined) target.email = String(parsed.email).trim().toLowerCase();
    if (parsed.phone !== undefined) target.phone = String(parsed.phone);
    if (parsed.isActive !== undefined) target.isActive = Boolean(parsed.isActive);
    save();
    return respond(res, 200, { user: safeUser(target) });
  }

  if (method === 'GET' && path === '/admin/shipping') {
    const q = url.searchParams.get('q') || '';
    const status = url.searchParams.get('status') || 'all';
    return respond(res, 200, {
      orders: filterOrders(orders, { q, status }),
      statuses: ORDER_STATUSES,
      carriers: db.settings.shippingCarriers || [],
    });
  }

  if (method === 'PATCH' && path.startsWith('/admin/shipping/')) {
    const code = decodeURIComponent(path.slice('/admin/shipping/'.length));
    const order = orders.find((o) => o.orderCode === code);
    if (!order) return error(res, 404, 'Order not found');
    order.shippingInfo = {
      carrier: parsed.carrier ?? order.shippingInfo?.carrier ?? '',
      trackingNumber: parsed.trackingNumber ?? order.shippingInfo?.trackingNumber ?? '',
      estimatedDelivery: parsed.estimatedDelivery ?? order.shippingInfo?.estimatedDelivery ?? '',
      notes: parsed.notes ?? order.shippingInfo?.notes ?? '',
    };
    if (parsed.status) order.status = parsed.status;
    save();
    return respond(res, 200, { order });
  }

  if (method === 'GET' && path === '/admin/analytics/engagement') {
    const cartEntries = Object.entries(db.carts);
    const wishEntries = Object.entries(db.wishlists);
    const cartQtyBySlug = new Map();
    const cartUsersBySlug = new Map();
    const wishCountBySlug = new Map();
    const activity = [];

    for (const [userId, items] of cartEntries) {
      const owner = db.users.find((u) => u.id === userId);
      for (const item of items) {
        cartQtyBySlug.set(item.slug, (cartQtyBySlug.get(item.slug) || 0) + (item.qty || 0));
        const users = cartUsersBySlug.get(item.slug) || new Set();
        users.add(userId);
        cartUsersBySlug.set(item.slug, users);
        const product = findProduct(item.slug);
        activity.push({
          type: 'cart',
          userId,
          userName: owner?.name || 'Customer',
          product: product?.name || item.slug,
          at: new Date().toISOString(),
        });
      }
    }

    for (const [userId, slugs] of wishEntries) {
      const owner = db.users.find((u) => u.id === userId);
      for (const slug of slugs) {
        wishCountBySlug.set(slug, (wishCountBySlug.get(slug) || 0) + 1);
        const product = findProduct(slug);
        activity.push({
          type: 'wishlist',
          userId,
          userName: owner?.name || 'Customer',
          product: product?.name || slug,
          at: new Date().toISOString(),
        });
      }
    }

    const popularWishlist = [...wishCountBySlug.entries()]
      .map(([slug, wishlistCount]) => {
        const product = findProduct(slug);
        return product
          ? { slug, name: product.name, image: product.image, price: product.price, wishlistCount }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.wishlistCount - a.wishlistCount)
      .slice(0, 10);

    const popularCart = [...cartQtyBySlug.entries()]
      .map(([slug, cartQty]) => {
        const product = findProduct(slug);
        return product
          ? {
              slug,
              name: product.name,
              image: product.image,
              price: product.price,
              cartQty,
              cartUsers: cartUsersBySlug.get(slug)?.size || 0,
            }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.cartQty - a.cartQty)
      .slice(0, 10);

    return respond(res, 200, {
      summary: {
        activeCarts: cartEntries.filter(([, items]) => items.length > 0).length,
        totalCartUnits: [...cartQtyBySlug.values()].reduce((n, x) => n + x, 0),
        wishlistsWithItems: wishEntries.filter(([, items]) => items.length > 0).length,
        totalWishlistItems: [...wishCountBySlug.values()].reduce((n, x) => n + x, 0),
      },
      popularWishlist,
      popularCart,
      activity: activity.slice(0, 30),
    });
  }

  if (method === 'GET' && path === '/admin/settings') {
    return respond(res, 200, { settings: db.settings });
  }

  if (method === 'PUT' && path === '/admin/settings') {
    db.settings = { ...db.settings, ...parsed };
    save();
    return respond(res, 200, { settings: db.settings });
  }

  if (method === 'PUT' && path === '/admin/account/password') {
    if (user.password !== hash(parsed.currentPassword || '')) {
      return error(res, 400, 'Current password is incorrect');
    }
    if (!parsed.newPassword || parsed.newPassword.length < 6) {
      return error(res, 400, 'New password must have at least 6 characters');
    }
    user.password = hash(parsed.newPassword);
    save();
    return respond(res, 200, { ok: true });
  }

  return error(res, 404, 'Admin route not found');
}

function sendMissingBuild(res) {
  res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(
    '<!doctype html><html><body style="font-family:sans-serif;padding:2rem">' +
      '<h1>Daljheel build missing</h1>' +
      '<p>The <code>dist</code> folder was not found. On Render, Build Command must run ' +
      '<code>npm install --include=dev &amp;&amp; npm run build</code> and Start Command must be ' +
      '<code>node server.js</code>.</p></body></html>'
  );
}

function serve(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) {
    return api(req, res, url).catch((e) => error(res, 400, e.message));
  }

  const indexFile = join(distDir, 'index.html');
  if (!existsSync(indexFile)) {
    return sendMissingBuild(res);
  }

  // Strip leading slashes so path.join does not drop distDir on Linux
  const relativePath = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
  let candidate = normalize(join(distDir, relativePath));
  if (!candidate.startsWith(normalize(distDir)) || !existsSync(candidate) || statSync(candidate).isDirectory()) {
    candidate = indexFile;
  }

  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
  };

  res.writeHead(200, { 'Content-Type': types[extname(candidate)] || 'application/octet-stream' });
  createReadStream(candidate)
    .on('error', () => {
      if (!res.headersSent) sendMissingBuild(res);
      else res.end();
    })
    .pipe(res);
}

function listen(port) {
  const server = http.createServer(serve);
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && !hasPlatformPort && port < requestedPort + 10) {
      console.log(`Port ${port} is busy; starting Daljheel on port ${port + 1} instead.`);
      listen(port + 1);
      return;
    }
    console.error(`Unable to start Daljheel on port ${port}: ${err.message}`);
    process.exitCode = 1;
  });
  server.listen(port, '0.0.0.0', () => {
    const hasDist = existsSync(join(distDir, 'index.html'));
    console.log(`Daljheel app running at http://localhost:${port}`);
    console.log(`Serving static files from ${distDir} (index.html ${hasDist ? 'found' : 'MISSING'})`);
  });
}

listen(requestedPort);
