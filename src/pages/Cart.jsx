import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, setQty, removeItem, totals } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <section className="page-wrap py-16 text-center sm:py-20">
        <h1 className="section-heading mb-4">Your cart</h1>
        <p className="mb-6 text-ink-muted">Your cart is empty.</p>
        <Link to="/shop" className="btn-primary">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-cream-light to-cream py-8 lg:py-16">
      <div className="page-wrap">
        <p className="section-label mb-2">Cart</p>
        <h1 className="section-heading mb-6">Your selection</h1>

        {/* Mobile: single column stack | Desktop: sidebar layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
          <ul className="divide-y divide-gold/20 border border-gold/25 bg-white">
            {items.map((item) => (
              <li key={item.slug} className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4">
                {item.image && (
                  <img src={item.image} alt="" className="h-16 w-16 shrink-0 rounded-sm object-cover sm:h-20 sm:w-20" />
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.slug}`} className="font-display text-base text-ink hover:text-gold sm:text-lg">
                    {item.name}
                  </Link>
                  {item.size && <p className="text-xs text-ink-muted sm:text-sm">{item.size}</p>}
                  {item.price != null && (
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="font-semibold text-ink text-sm sm:text-base">₹{item.price}</span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-ink-muted line-through">₹{item.mrp}</span>
                      )}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <div className="flex items-center border border-gold/30">
                      <button type="button" className="px-2.5 py-1 sm:px-3" onClick={() => setQty(item.slug, item.qty - 1)}>
                        −
                      </button>
                      <span className="w-7 text-center text-sm sm:w-8">{item.qty}</span>
                      <button type="button" className="px-2.5 py-1 sm:px-3" onClick={() => setQty(item.slug, item.qty + 1)}>
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-brand-red hover:underline sm:text-sm"
                      onClick={() => removeItem(item.slug)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {item.lineTotal != null && (
                  <p className="shrink-0 font-semibold text-ink text-sm sm:text-base">₹{item.lineTotal}</p>
                )}
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-gold/25 bg-white p-4 sm:p-6">
            <h2 className="font-display text-lg text-ink sm:text-xl">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <SummaryRow label="Subtotal" value={`₹${totals.subtotal}`} />
              {totals.discount > 0 && (
                <SummaryRow label="Discount" value={`−₹${totals.discount}`} accent />
              )}
              <SummaryRow
                label="Shipping"
                value={totals.shipping === 0 ? 'Free' : `₹${totals.shipping}`}
              />
              {totals.shipping > 0 && (
                <p className="text-xs text-ink-muted">
                  Free shipping on orders above ₹{totals.freeShippingThreshold}
                </p>
              )}
              <div className="border-t border-gold/20 pt-3">
                <SummaryRow label="Total" value={`₹${totals.total}`} bold />
              </div>
            </div>

            {!isAuthenticated && (
              <p className="mt-4 text-xs text-ink-muted">
                <Link to="/login" className="text-gold hover:underline">
                  Sign in
                </Link>{' '}
                to sync your cart across devices.
              </p>
            )}

            <Link to="/checkout" className="btn-primary mt-5 w-full">
              Proceed to checkout
            </Link>
            <Link to="/shop" className="mt-3 block text-center text-sm text-gold hover:underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value, bold, accent }) {
  return (
    <div
      className={`flex justify-between ${
        bold ? 'text-base font-semibold text-ink' : accent ? 'text-brand-red' : 'text-ink-muted'
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
