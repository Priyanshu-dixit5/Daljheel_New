import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminOrder, adminOrders, adminUpdateOrder } from '../../api';
import { inr, PageHeader, Panel, Spinner, StatusBadge } from './adminUi';

export default function AdminOrders() {
  const { orderCode } = useParams();
  if (orderCode) return <OrderDetail orderCode={orderCode} />;
  return <OrderList />;
}

function OrderList() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      adminOrders({ q, status })
        .then(setData)
        .catch((err) => setError(err.message));
    }, 200);
    return () => clearTimeout(t);
  }, [q, status]);

  return (
    <div className="space-y-6">
      <PageHeader kicker="Fulfilment" title="Orders" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search order, name, phone, tracking…"
          className="admin-input flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="admin-input sm:w-48"
        >
          <option value="all">All statuses</option>
          {(data?.statuses || []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-error">{error}</p>}
      {!data ? (
        <Spinner />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {data.orders.map((o) => (
              <Link key={o.orderCode} to={`/admin/orders/${o.orderCode}`} className="admin-card block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{o.orderCode}</p>
                    <p className="text-xs text-ink-muted">{o.customer?.name}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-2 text-sm font-medium">{inr(o.total)}</p>
              </Link>
            ))}
            {data.orders.length === 0 && <p className="py-8 text-center text-ink-muted">No orders found</p>}
          </div>

          <div className="admin-card hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gold/20 bg-cream/60 text-xs uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {data.orders.map((o) => (
                  <tr key={o.orderCode} className="hover:bg-cream/40">
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders/${o.orderCode}`} className="font-medium text-ink hover:text-gold">
                        {o.orderCode}
                      </Link>
                      <p className="text-xs text-ink-muted">{o.items?.length || 0} items</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{o.customer?.name}</p>
                      <p className="text-xs text-ink-muted">{o.customer?.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{inr(o.total)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data.orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function OrderDetail({ orderCode }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function load() {
    adminOrder(orderCode)
      .then((res) => {
        setData(res);
        setStatus(res.order.status);
        setAdminNote(res.order.adminNote || '');
      })
      .catch((err) => setError(err.message));
  }

  useEffect(load, [orderCode]);

  async function save() {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await adminUpdateOrder(orderCode, { status, adminNote });
      setData((d) => ({ ...d, order: res.order }));
      setMessage('Order updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (error && !data) return <p className="text-error">{error}</p>;
  if (!data) return <Spinner />;

  const { order, user, statuses } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/orders" className="text-sm text-gold hover:underline">
          ← All orders
        </Link>
        <h1 className="mt-2 font-display text-3xl text-ink">{order.orderCode}</h1>
        <p className="text-sm text-ink-muted">{new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Panel title="Items">
            <ul className="divide-y divide-gold/15">
              {order.items.map((item) => (
                <li key={item.slug} className="flex items-center gap-3 py-3">
                  {item.image && (
                    <img src={item.image} alt="" className="h-12 w-12 rounded-sm object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-ink">{item.name}</p>
                    <p className="text-xs text-ink-muted">
                      Qty {item.qty} · {inr(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{inr(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-gold/20 pt-3 text-sm">
              <Row label="Subtotal" value={inr(order.subtotal)} />
              {order.discount > 0 && <Row label="Discount" value={`−${inr(order.discount)}`} />}
              <Row label="Shipping" value={order.shipping ? inr(order.shipping) : 'Free'} />
              <Row label="Total" value={inr(order.total)} bold />
            </div>
          </Panel>

          <Panel title="Customer & delivery">
            <p className="text-sm text-ink">{order.customer?.name}</p>
            <p className="text-sm text-ink-muted">{order.customer?.phone}</p>
            <p className="mt-2 text-sm text-ink-muted">{order.customer?.address}</p>
            {order.customer?.note && (
              <p className="mt-2 text-sm text-ink-muted">Note: {order.customer.note}</p>
            )}
            {order.shippingInfo?.trackingNumber && (
              <p className="mt-3 text-sm text-ink">
                Tracking: {order.shippingInfo.carrier ? `${order.shippingInfo.carrier} · ` : ''}
                {order.shippingInfo.trackingNumber}
              </p>
            )}
            {user && (
              <Link to={`/admin/users/${user.id}`} className="mt-3 inline-block text-sm text-gold hover:underline">
                View customer profile
              </Link>
            )}
          </Panel>
        </div>

        <Panel title="Update status">
          <label className="block text-sm">
            <span className="mb-1 block text-ink-muted">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input">
              {(statuses || []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-ink-muted">Admin note</span>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="admin-input"
            />
          </label>
          {order.paymentLabel && (
            <p className="mt-3 text-xs text-ink-muted">Payment: {order.paymentLabel}</p>
          )}
          {message && <p className="mt-3 text-sm text-success">{message}</p>}
          {error && <p className="mt-3 text-sm text-error">{error}</p>}
          <button type="button" disabled={saving} onClick={save} className="btn-primary mt-4 w-full">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <Link
            to={`/admin/shipping?focus=${order.orderCode}`}
            className="mt-3 block text-center text-sm text-gold hover:underline"
          >
            Manage shipping
          </Link>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold text-ink' : 'text-ink-muted'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
