import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();
  const image = product.images?.[0];
  const wished = isWishlisted(product.slug);

  async function onWish(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/shop' } });
      return;
    }
    try {
      await toggle(product.slug);
    } catch {
      // ignore
    }
  }

  return (
    <article className="group overflow-hidden rounded-sm border border-gold/20 bg-white transition hover:shadow-md">
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-contain bg-cream p-3 transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-2.5 top-2.5 rounded-sm bg-white/90 px-2 py-0.5 text-[10px] capitalize text-ink-muted">
          {product.category.replace('-', ' ')}
        </span>
        <button
          type="button"
          onClick={onWish}
          aria-label="Toggle wishlist"
          className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-1.5 text-ink shadow-sm transition hover:text-gold"
        >
          <Heart className={`h-3.5 w-3.5 ${wished ? 'fill-gold text-gold' : ''}`} />
        </button>
      </Link>

      <div className="p-3 sm:p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display text-base leading-snug text-ink sm:text-lg">{product.name}</h3>
        </Link>
        {product.size ? (
          <p className="mt-0.5 text-xs text-ink-muted sm:mt-1 sm:text-sm">{product.size}</p>
        ) : (
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted sm:mt-1 sm:text-sm">{product.description}</p>
        )}

        <div className="mt-2.5 flex items-end justify-between sm:mt-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-semibold text-ink sm:text-lg">₹{product.price}</span>
              <span className="text-xs text-ink-muted line-through sm:text-sm">₹{product.mrp}</span>
            </div>
            {product.discount > 0 && (
              <span className="text-[11px] font-medium text-brand-red">Save {product.discount}%</span>
            )}
          </div>
          <button
            type="button"
            disabled={!product.isAvailable}
            onClick={() => addItem(product)}
            className="flex items-center gap-1 rounded-sm border border-purple/20 px-2.5 py-1.5 text-xs text-ink transition hover:border-purple hover:bg-purple hover:text-cream disabled:opacity-40 sm:px-3 sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default function TrendyProducts({ products }) {
  return (
    <section className="bg-[#fffdf8] py-10 lg:py-20">
      <div className="page-wrap">
        <div className="mb-7 flex items-end justify-between lg:mb-10">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#a6553b]">Picked for your pantry</p>
            <h2 className="font-display text-2xl text-[#292d28] sm:text-3xl md:text-4xl">Trendy products</h2>
          </div>
          <Link to="/shop" className="link-arrow hidden sm:inline-flex">
            Explore all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile "see all" link */}
        <div className="mt-6 text-center sm:hidden">
          <Link to="/shop" className="link-arrow justify-center">
            Explore all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
