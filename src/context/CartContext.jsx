import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  addToCartApi,
  clearCartApi,
  fetchCart,
  mergeCartApi,
  removeFromCartApi,
  updateCartQtyApi,
} from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'dfm-cart';

function loadGuestCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const emptyTotals = {
  subtotal: 0,
  discount: 0,
  mrpTotal: 0,
  shipping: 0,
  freeShippingThreshold: 999,
  total: 0,
};

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState(loadGuestCart);
  const [totals, setTotals] = useState(emptyTotals);
  const [syncing, setSyncing] = useState(false);

  const applyServerCart = useCallback((data) => {
    const nextItems = (data.items || []).map((item) => ({
      slug: item.slug,
      name: item.name,
      image: item.image,
      qty: item.qty,
      price: item.price,
      mrp: item.mrp,
      size: item.size,
      lineTotal: item.lineTotal,
      lineDiscount: item.lineDiscount,
      isAvailable: item.isAvailable,
    }));
    setItems(nextItems);
    setTotals({
      subtotal: data.subtotal ?? 0,
      discount: data.discount ?? 0,
      mrpTotal: data.mrpTotal ?? 0,
      shipping: data.shipping ?? 0,
      freeShippingThreshold: data.freeShippingThreshold ?? 999,
      total: data.total ?? 0,
    });
    saveGuestCart(nextItems.map((i) => ({ slug: i.slug, name: i.name, image: i.image, qty: i.qty })));
  }, []);

  const computeLocalTotals = useCallback((list) => {
    const subtotal = list.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
    const discount = list.reduce((s, i) => s + Math.max(0, (i.mrp || 0) - (i.price || 0)) * i.qty, 0);
    const mrpTotal = list.reduce((s, i) => s + (i.mrp || 0) * i.qty, 0);
    const shipping = list.length === 0 || subtotal >= 999 ? 0 : 79;
    return {
      subtotal,
      discount,
      mrpTotal,
      shipping,
      freeShippingThreshold: 999,
      total: subtotal + shipping,
    };
  }, []);

  // Sync cart when auth state changes
  useEffect(() => {
    let cancelled = false;

    async function sync() {
      if (!isAuthenticated) {
        const guest = loadGuestCart();
        if (!cancelled) {
          setItems(guest);
          setTotals(computeLocalTotals(guest));
        }
        return;
      }

      setSyncing(true);
      try {
        const guest = loadGuestCart();
        let data;
        if (guest.length > 0) {
          data = await mergeCartApi(guest.map((i) => ({ slug: i.slug, qty: i.qty })));
        } else {
          data = await fetchCart();
        }
        if (!cancelled) applyServerCart(data);
      } catch {
        if (!cancelled) {
          const guest = loadGuestCart();
          setItems(guest);
          setTotals(computeLocalTotals(guest));
        }
      } finally {
        if (!cancelled) setSyncing(false);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id, applyServerCart, computeLocalTotals]);

  // Persist guest cart locally
  useEffect(() => {
    if (!isAuthenticated) {
      saveGuestCart(items.map((i) => ({ slug: i.slug, name: i.name, image: i.image, qty: i.qty })));
      setTotals(computeLocalTotals(items));
    }
  }, [items, isAuthenticated, computeLocalTotals]);

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);

    async function addItem(product, qty = 1) {
      if (isAuthenticated) {
        const data = await addToCartApi(product.slug, qty);
        applyServerCart(data);
        return;
      }
      setItems((prev) => {
        const existing = prev.find((item) => item.slug === product.slug);
        if (existing) {
          return prev.map((item) =>
            item.slug === product.slug ? { ...item, qty: item.qty + qty } : item
          );
        }
        return [
          ...prev,
          {
            slug: product.slug,
            name: product.name,
            image: product.images?.[0] || product.image,
            qty,
            price: product.price,
            mrp: product.mrp,
          },
        ];
      });
    }

    async function setQty(slug, qty) {
      if (isAuthenticated) {
        const data = await updateCartQtyApi(slug, Math.max(0, qty));
        applyServerCart(data);
        return;
      }
      if (qty < 1) {
        setItems((prev) => prev.filter((item) => item.slug !== slug));
        return;
      }
      setItems((prev) => prev.map((item) => (item.slug === slug ? { ...item, qty } : item)));
    }

    async function removeItem(slug) {
      if (isAuthenticated) {
        const data = await removeFromCartApi(slug);
        applyServerCart(data);
        return;
      }
      setItems((prev) => prev.filter((item) => item.slug !== slug));
    }

    async function clearCart() {
      if (isAuthenticated) {
        try {
          const data = await clearCartApi();
          applyServerCart(data);
        } catch {
          setItems([]);
          setTotals(emptyTotals);
        }
        return;
      }
      setItems([]);
      setTotals(emptyTotals);
      saveGuestCart([]);
    }

    async function refreshCart() {
      if (!isAuthenticated) return;
      const data = await fetchCart();
      applyServerCart(data);
    }

    return {
      items,
      count,
      totals,
      syncing,
      addItem,
      setQty,
      removeItem,
      clearCart,
      refreshCart,
      applyServerCart,
    };
  }, [items, totals, syncing, isAuthenticated, applyServerCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
