import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, fetchAddresses } from '../api';

export default function Checkout() {
  const { items, clearCart, totals } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [useSaved, setUseSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    note: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || '',
        phone: f.phone || user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAddresses()
      .then((list) => {
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) {
          setAddressId(def.id);
          setUseSaved(true);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  if (items.length === 0) {
    return (
      <section className="page-wrap py-20 text-center">
        <p className="text-ink-muted">Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-gold">
          Go to shop
        </Link>
      </section>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((item) => ({ slug: item.slug, qty: item.qty })),
        customer: useSaved && addressId
          ? { note: form.note }
          : form,
      };
      if (useSaved && addressId) payload.addressId = addressId;

      const result = await createOrder(payload);
      await clearCart();
      if (result.whatsappUrl) window.open(result.whatsappUrl, '_blank');
      navigate(`/order/${result.order.orderCode}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-gradient-to-b from-cream-light to-cream py-12 lg:py-16">
      <div className="page-wrap">
        <p className="section-label mb-3">Checkout</p>
        <h1 className="section-heading mb-2">Complete your order</h1>
        <p className="mb-8 max-w-xl text-sm text-ink-muted">
          Review your delivery details, then confirm your order on WhatsApp.
        </p>

        <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="border border-gold/25 bg-white p-6">
              <h2 className="font-display text-xl text-ink">Delivery address</h2>

              {isAuthenticated && addresses.length > 0 && (
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="radio"
                      checked={useSaved}
                      onChange={() => setUseSaved(true)}
                    />
                    Use a saved address
                  </label>
                  {useSaved && (
                    <div className="space-y-2 pl-6">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`block cursor-pointer rounded-sm border p-3 text-sm ${
                            addressId === addr.id ? 'border-gold bg-cream/60' : 'border-gold/20'
                          }`}
                        >
                          <input
                            type="radio"
                            className="mr-2"
                            checked={addressId === addr.id}
                            onChange={() => setAddressId(addr.id)}
                          />
                          <span className="font-medium">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="ml-2 text-xs text-gold">Default</span>
                          )}
                          <p className="mt-1 text-ink-muted">
                            {addr.name} · {addr.phone}
                          </p>
                          <p className="text-ink-muted">
                            {[addr.line1, addr.line2, addr.city, addr.state, addr.pincode]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        </label>
                      ))}
                      <Link to="/account/addresses" className="text-sm text-gold hover:underline">
                        Manage addresses
                      </Link>
                    </div>
                  )}
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="radio"
                      checked={!useSaved}
                      onChange={() => setUseSaved(false)}
                    />
                    Enter address manually
                  </label>
                </div>
              )}

              {(!useSaved || !isAuthenticated || addresses.length === 0) && (
                <div className="mt-4 space-y-4">
                  <Field
                    label="Name"
                    required
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                  />
                  <Field
                    label="Phone"
                    required
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                  />
                  <label className="block text-sm">
                    <span className="mb-1 block text-ink">Address</span>
                    <textarea
                      required={!useSaved}
                      rows={4}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full rounded-sm border border-gold/30 bg-cream-light/40 px-3 py-2 outline-none focus:border-gold focus:bg-white"
                    />
                  </label>
                </div>
              )}

              <label className="mt-4 block text-sm">
                <span className="mb-1 block text-ink">Note (optional)</span>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full rounded-sm border border-gold/30 bg-cream-light/40 px-3 py-2 outline-none focus:border-gold focus:bg-white"
                />
              </label>
            </div>

          </div>

          <aside className="h-fit border border-gold/25 bg-white p-6">
            <h2 className="font-display text-xl text-ink">Order summary</h2>
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
              {items.map((item) => (
                <li key={item.slug} className="flex justify-between gap-2 text-ink-muted">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>₹{(item.price || 0) * item.qty || item.lineTotal || '—'}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-gold/20 pt-4 text-sm">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal</span>
                <span>₹{totals.subtotal}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-brand-red">
                  <span>Discount</span>
                  <span>−₹{totals.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? 'Free' : `₹${totals.shipping}`}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-ink">
                <span>Total</span>
                <span>₹{totals.total}</span>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-error">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
              {submitting ? 'Opening WhatsApp…' : 'Confirm on WhatsApp'}
            </button>
            {!isAuthenticated && (
              <p className="mt-3 text-center text-xs text-ink-muted">
                <Link to="/login" className="text-gold hover:underline">
                  Sign in
                </Link>{' '}
                to save this order to your account.
              </p>
            )}
          </aside>
        </form>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, required }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-gold/30 bg-cream-light/40 px-3 py-2 outline-none focus:border-gold focus:bg-white"
      />
    </label>
  );
}
