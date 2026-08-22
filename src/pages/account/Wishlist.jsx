import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistPage() {
  const { items, loading, remove, moveToCart } = useWishlist();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border border-gold/25 bg-white p-10 text-center">
        <Heart className="mx-auto mb-3 h-8 w-8 text-gold" />
        <h2 className="font-display text-2xl text-ink">Your wishlist is empty</h2>
        <p className="mt-2 text-sm text-ink-muted">Save Kashmiri favourites to revisit later.</p>
        <Link to="/shop" className="btn-primary mt-6">
          Browse collection
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-gold/25 bg-white p-6">
      <h2 className="font-display text-2xl text-ink">Wishlist</h2>
      <p className="mt-1 text-sm text-ink-muted">{items.length} saved item{items.length === 1 ? '' : 's'}</p>

      <ul className="mt-6 divide-y divide-gold/15">
        {items.map((entry) => {
          const product = entry.product || entry;
          const slug = entry.slug || product.slug;
          if (!product?.name || !slug) return null;
          return (
          <li key={slug} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
            <Link to={`/product/${slug}`} className="flex flex-1 items-center gap-4">
              <img
                src={product.images?.[0] || product.image}
                alt=""
                className="h-20 w-20 rounded-sm border border-gold/20 bg-cream object-contain p-1"
              />
              <div>
                <p className="font-display text-lg text-ink">{product.name}</p>
                {product.size && <p className="text-sm text-ink-muted">{product.size}</p>}
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-semibold text-ink">₹{product.price}</span>
                  <span className="text-sm text-ink-muted line-through">₹{product.mrp}</span>
                </div>
              </div>
            </Link>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => moveToCart(slug)}
                disabled={!product.isAvailable}
                className="btn-primary gap-2 px-4 py-2 text-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                Move to cart
              </button>
              <button
                type="button"
                onClick={() => remove(slug)}
                className="inline-flex items-center gap-2 rounded-sm border border-gold/30 px-4 py-2 text-sm text-ink-muted hover:border-error hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
