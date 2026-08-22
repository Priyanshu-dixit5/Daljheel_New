import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminShipping, adminUpdateShipping } from '../../api';
import { PageHeader, Panel, Spinner, StatusBadge } from './adminUi';

export default function AdminShipping() {
  const [params] = useSearchParams();
  const focus = params.get('focus') || '';
  const [q, setQ] = useState(focus);
  const [status, setStatus] = useState('all');
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    status: '',
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function load() {
    adminShipping({ q, status })
      .then((res) => {
        setData(res);
        const pick =
          res.orders.find((o) => o.orderCode === (selected?.orderCode || focus)) || res.orders[0] || null;
        if (pick) selectOrder(pick);
        else setSelected(null);
      })
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  function selectOrder(order) {
    setSelected(order);
    setForm({
      status: order.status || '',
      carrier: order.shippingInfo?.carrier || '',
      trackingNumber: order.shippingInfo?.trackingNumber || '',
      estimatedDelivery: order.shippingInfo?.estimatedDelivery || '',
      notes: order.shippingInfo?.notes || '',
    });
    setMessage('');
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await adminUpdateShipping(selected.orderCode, form);
      setSelected(res.order);
      setData((d) => ({
        ...d,
        orders: d.orders.map((o) => (o.orderCode === res.order.orderCode ? res.order : o)),
      }));
      setMessage('Shipping details saved');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader kicker="Logistics" title="Shipping" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search order, customer, tracking…"
          className="admin-input flex-1"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input sm:w-48">
          <option value="all">All statuses</option>
          {(data?.statuses || []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && !data && <p className="text-error">{error}</p>}
      {!data ? (
        <Spinner />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="admin-card overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gold/20 bg-cream/60 text-xs uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tracking</th>
                  <th className="px-4 py-3">Carrier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {data.orders.map((o) => (
                  <tr
                    key={o.orderCode}
                    className={`cursor-pointer hover:bg-cream/40 ${
                      selected?.orderCode === o.orderCode ? 'bg-gold/10' : ''
                    }`}
                    onClick={() => selectOrder(o)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{o.orderCode}</p>
                      <p className="text-xs text-ink-muted">{o.customer?.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{o.shippingInfo?.trackingNumber || '—'}</td>
                    <td className="px-4 py-3 text-ink-muted">{o.shippingInfo?.carrier || '—'}</td>
                  </tr>
                ))}
                {data.orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                      No shipments to manage
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Panel title={selected ? selected.orderCode : 'Select an order'}>
            {selected ? (
              <div className="space-y-3">
                <p className="text-sm text-ink-muted">{selected.customer?.address}</p>
                <Field label="Delivery status">
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="admin-input"
                  >
                    {(data.statuses || []).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Carrier">
                  <select
                    value={form.carrier}
                    onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                    className="admin-input"
                  >
                    <option value="">Select carrier</option>
                    {(data.carriers || []).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Tracking number">
                  <input
                    value={form.trackingNumber}
                    onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Estimated delivery">
                  <input
                    type="date"
                    value={form.estimatedDelivery}
                    onChange={(e) => setForm({ ...form, estimatedDelivery: e.target.value })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Shipping notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="admin-input"
                  />
                </Field>
                {message && <p className="text-sm text-success">{message}</p>}
                {error && <p className="text-sm text-error">{error}</p>}
                <button type="button" disabled={saving} onClick={save} className="btn-primary w-full">
                  {saving ? 'Saving…' : 'Update shipping'}
                </button>
                <Link
                  to={`/admin/orders/${selected.orderCode}`}
                  className="block text-center text-sm text-gold hover:underline"
                >
                  Full order details
                </Link>
              </div>
            ) : (
              <p className="text-sm text-ink-muted">Choose an order to edit shipping.</p>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
