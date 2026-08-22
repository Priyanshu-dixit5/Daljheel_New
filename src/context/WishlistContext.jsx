import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  addToWishlist,
  fetchWishlist,
  moveWishlistToCart,
  removeFromWishlist,
} from '../api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { applyServerCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchWishlist();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh, user?.id]);

  const value = useMemo(() => {
    const slugs = new Set(items.map((i) => i.slug || i.product?.slug).filter(Boolean));

    function isWishlisted(slug) {
      return slugs.has(slug);
    }

    async function toggle(slug) {
      if (!isAuthenticated) {
        throw new Error('Please sign in to use wishlist');
      }
      if (slugs.has(slug)) {
        const data = await removeFromWishlist(slug);
        setItems(data.items || []);
        return false;
      }
      const data = await addToWishlist(slug);
      setItems(data.items || []);
      return true;
    }

    async function remove(slug) {
      const data = await removeFromWishlist(slug);
      setItems(data.items || []);
    }

    async function moveToCart(slug) {
      const data = await moveWishlistToCart(slug);
      setItems(data.wishlist?.items || []);
      if (data.cart) applyServerCart(data.cart);
    }

    return {
      items,
      count: items.length,
      loading,
      isWishlisted,
      toggle,
      remove,
      moveToCart,
      refresh,
    };
  }, [items, loading, isAuthenticated, applyServerCart, refresh]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
