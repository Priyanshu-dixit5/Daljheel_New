const API_BASE = '/api';
const TOKEN_KEY = 'dfm-token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = false, formData } = {}) {
  const headers = {};
  if (!formData) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData || (body !== undefined ? JSON.stringify(body) : undefined),
  });

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || 'Unexpected response' };
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${path}`);
  }
  return data;
}

export function fetchContent() {
  return request('/content');
}

export function fetchCategories() {
  return request('/categories');
}

export function fetchCategory(slug) {
  return request(`/categories/${slug}`);
}

export function fetchProducts({ category, search } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  const qs = params.toString();
  return request(`/products${qs ? `?${qs}` : ''}`);
}

export function fetchProduct(slug) {
  return request(`/products/${slug}`);
}

export function fetchSocialLinks() {
  return request('/social-links');
}

export function fetchBanners() {
  return request('/banners');
}

export function createOrder(payload) {
  return request('/orders', { method: 'POST', body: payload, auth: true });
}

/* Auth */
export function register(payload) {
  return request('/auth/register', { method: 'POST', body: payload });
}

export function login(payload) {
  return request('/auth/login', { method: 'POST', body: payload });
}

export function fetchMe() {
  return request('/auth/me', { auth: true });
}

export function logoutApi() {
  return request('/auth/logout', { method: 'POST', auth: true });
}

/* Users */
export function fetchProfile() {
  return request('/users/profile', { auth: true });
}

export function updateProfile(payload) {
  return request('/users/profile', { method: 'PUT', body: payload, auth: true });
}

export function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  return request('/users/avatar', { method: 'POST', formData, auth: true });
}

export function fetchDashboard() {
  return request('/users/dashboard', { auth: true });
}

/* Wishlist */
export function fetchWishlist() {
  return request('/wishlist', { auth: true });
}

export function addToWishlist(slug) {
  return request('/wishlist', { method: 'POST', body: { slug }, auth: true });
}

export function removeFromWishlist(slug) {
  return request(`/wishlist/${encodeURIComponent(slug)}`, { method: 'DELETE', auth: true });
}

export function moveWishlistToCart(slug) {
  return request('/wishlist/move-to-cart', { method: 'POST', body: { slug }, auth: true });
}

/* Cart */
export function fetchCart() {
  return request('/cart', { auth: true });
}

export function addToCartApi(slug, qty = 1) {
  return request('/cart', { method: 'POST', body: { slug, qty }, auth: true });
}

export function updateCartQtyApi(slug, qty) {
  return request(`/cart/${encodeURIComponent(slug)}`, { method: 'PUT', body: { qty }, auth: true });
}

export function removeFromCartApi(slug) {
  return request(`/cart/${encodeURIComponent(slug)}`, { method: 'DELETE', auth: true });
}

export function clearCartApi() {
  return request('/cart', { method: 'DELETE', auth: true });
}

export function mergeCartApi(items) {
  return request('/cart/merge', { method: 'POST', body: { items }, auth: true });
}

/* Addresses */
export function fetchAddresses() {
  return request('/addresses', { auth: true });
}

export function createAddress(payload) {
  return request('/addresses', { method: 'POST', body: payload, auth: true });
}

export function updateAddress(id, payload) {
  return request(`/addresses/${encodeURIComponent(id)}`, { method: 'PUT', body: payload, auth: true });
}

export function deleteAddress(id) {
  return request(`/addresses/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
}

export function setDefaultAddress(id) {
  return request(`/addresses/${encodeURIComponent(id)}/default`, { method: 'POST', auth: true });
}

/* Orders */
export function fetchMyOrders() {
  return request('/orders/mine', { auth: true });
}

export function fetchOrder(orderCode) {
  return request(`/orders/${encodeURIComponent(orderCode)}`, { auth: true });
}

/* Admin */
export function adminLogin(payload) {
  return request('/admin/login', { method: 'POST', body: payload });
}

export function adminChangePassword(payload) {
  return request('/admin/account/password', { method: 'PUT', body: payload, auth: true });
}

export function adminDashboard() {
  return request('/admin/dashboard', { auth: true });
}

export function adminOrders({ q, status } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (status) params.set('status', status);
  const qs = params.toString();
  return request(`/admin/orders${qs ? `?${qs}` : ''}`, { auth: true });
}

export function adminOrder(orderCode) {
  return request(`/admin/orders/${encodeURIComponent(orderCode)}`, { auth: true });
}

export function adminUpdateOrder(orderCode, payload) {
  return request(`/admin/orders/${encodeURIComponent(orderCode)}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

export function adminUsers({ q, status } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (status) params.set('status', status);
  const qs = params.toString();
  return request(`/admin/users${qs ? `?${qs}` : ''}`, { auth: true });
}

export function adminUser(id) {
  return request(`/admin/users/${encodeURIComponent(id)}`, { auth: true });
}

export function adminUpdateUser(id, payload) {
  return request(`/admin/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

export function adminShipping({ q, status } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (status) params.set('status', status);
  const qs = params.toString();
  return request(`/admin/shipping${qs ? `?${qs}` : ''}`, { auth: true });
}

export function adminUpdateShipping(orderCode, payload) {
  return request(`/admin/shipping/${encodeURIComponent(orderCode)}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

export function adminEngagement() {
  return request('/admin/analytics/engagement', { auth: true });
}

export function adminGetSettings() {
  return request('/admin/settings', { auth: true });
}

export function adminSaveSettings(payload) {
  return request('/admin/settings', { method: 'PUT', body: payload, auth: true });
}
