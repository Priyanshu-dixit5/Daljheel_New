import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, MessageCircle, Plus } from 'lucide-react';
import { fetchProduct } from '../api';
import { useCart } from '../context/CartContext';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Product() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const content = useContent();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [wishMsg, setWishMsg] = useState('');

  useEffect(() => {
    setActiveImage(0);
    fetchProduct(slug)
      .then(setProduct)
      .catch(() => setError('Product not found'));
  }, [slug]);

  async function onWishlist() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${slug}` } });
      return;
    }
    try {
      const added = await toggle(product.slug);
      setWishMsg(added ? 'Saved to wishlist' : 'Removed from wishlist');
      setTimeout(() => setWishMsg(''), 2000);
    } catch (err) {
      setWishMsg(err.message);
    }
  }

  if (error) {
    return (
      <div className="page-wrap py-20 text-center">
        <p className="text-ink-muted">{error}</p>
        <Link to="/shop" className="mt-4 inline-block text-gold">Back to shop</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
      </div>
    );
  }

  const images = product.images || [];
  const image = images[activeImage] || images[0];
  const wished = isWishlisted(product.slug);

  return (
    <section className="bg-cream-light py-8 lg:py-16">
      <div className="page-wrap grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="overflow-hidden rounded-lg gold-border bg-white">
            <img src={image} alt={product.name} className="w-full max-h-[300px] sm:max-h-[420px] lg:max-h-none bg-cream object-contain p-4" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-sm border ${
                    i === activeImage ? 'border-gold' : 'border-gold/20'
                  }`}
                >
                  <img src={src} alt="" className="h-16 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="section-label mb-2 capitalize">{product.category.replace('-', ' ')}</p>
          <h1 className="font-display text-2xl text-ink sm:text-3xl md:text-4xl">{product.name}</h1>
          {product.size && <p className="mt-2 text-ink-muted">{product.size}</p>}
          <p className="mt-4 text-ink-muted">{product.description}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-ink sm:text-3xl">₹{product.price}</span>
            <span className="text-base text-ink-muted line-through sm:text-lg">₹{product.mrp}</span>
            {product.discount > 0 && (
              <span className="text-sm font-medium text-brand-red">Save {product.discount}%</span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center border border-gold/30">
              <button type="button" className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button type="button" className="px-3 py-2" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <button
              type="button"
              disabled={!product.isAvailable}
              onClick={() => addItem(product, qty)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4" />
              Add to cart
            </button>
            <button
              type="button"
              onClick={onWishlist}
              className={`inline-flex items-center gap-2 rounded-sm border px-4 py-3 text-sm transition ${
                wished
                  ? 'border-gold bg-gold/10 text-gold-muted'
                  : 'border-gold/30 text-ink hover:border-gold'
              }`}
            >
              <Heart className={`h-4 w-4 ${wished ? 'fill-gold text-gold' : ''}`} />
              {wished ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>
          {wishMsg && <p className="mt-2 text-sm text-gold">{wishMsg}</p>}

          {content?.whatsappDigits && (
            <a
              href={`https://wa.me/${content.whatsappDigits}?text=${encodeURIComponent(
                `Hello Daljheel Food Mart,\n\nI would like to ask about ${product.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-4"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </a>
          )}

          <p className="mt-6 text-sm text-ink-muted">{content?.shippingNote}</p>
          {!product.isAvailable && (
            <p className="mt-2 text-sm text-error">Currently unavailable.</p>
          )}
        </div>
      </div>
    </section>
  );
}
