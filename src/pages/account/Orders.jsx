import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import { fetchMyOrders, fetchOrder } from '../../api';

export default function Orders() {
  const { orderCode } = useParams();
  if (orderCode) return <OrderDetail orderCode={orderCode} />;
  return <OrderList />;
}

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : data?.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
      </div>
    );
  }

  if (error) return <p className="text-error">{error}</p>;

  if (orders.length === 0) {
    return (
      <div className="border border-gold/25 bg-white p-10 text-center">
        <Package className="mx-auto mb-3 h-8 w-8 text-gold" />
        <h2 className="font-display text-2xl text-ink">No orders yet</h2>
        <p className="mt-2 text-sm text-ink-muted">Your Kashmiri pantry orders will appear here.</p>
        <Link to="/shop" className="btn-primary mt-6">
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-gold/25 bg-white p-6">
      <h2 className="font-display text-2xl text-ink">My Orders</h2>
      <p className="mt-1 text-sm text-ink-muted">Track status and revisit past purchases.</p>
      <ul className="mt-6 divide-y divide-gold/15">
        {orders.map((order) => (
          <li key={order.orderCode} className="py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  to={`/account/orders/${order.orderCode}`}
                  className="font-display text-lg text-ink hover:text-gold"
                >
                  {order.orderCode}
                </Link>
                <p className="text-sm text-ink-muted">
                  {new Date(order.createdAt).toLocaleString()} · {order.items.length} item
                  {order.items.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-ink">₹{order.total}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {order.items.slice(0, 4).map((item) => (
                <img
                  key={`${order.orderCode}-${item.slug}`}
                  src={item.image}
                  alt=""
                  className="h-12 w-12 rounded-sm border border-gold/20 bg-cream object-cover"
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OrderDetail({ orderCode }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder(orderCode)
      .then((data) => setOrder(data?.order || data))
      .catch((err) => setError(err.message));
  }, [orderCode]);

  if (error) {
    return (
      <div className="border border-gold/25 bg-white p-6">
        <p className="text-error">{error}</p>
        <Link to="/account/orders" className="mt-4 inline-block text-gold">
          Back to orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border border-gold/25 bg-white p-6">
        <Link to="/account/orders" className="text-sm text-gold hover:underline">
          ← All orders
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-ink">{order.orderCode}</h2>
            <p className="text-sm text-ink-muted">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="border border-gold/25 bg-white p-6">
        <h3 className="font-display text-lg text-ink">Items</h3>
        <ul className="mt-4 divide-y divide-gold/15">
          {order.items.map((item) => (
            <li key={item.slug} className="flex items-center gap-4 py-3">
              {item.image && (
                <img src={item.image} alt="" className="h-14 w-14 rounded-sm object-cover" />
              )}
              <div className="flex-1">
                <p className="text-ink">{item.name}</p>
                <p className="text-sm text-ink-muted">
                  Qty {item.qty} · ₹{item.price}
                </p>
              </div>
              <p className="font-medium text-ink">₹{item.lineTotal}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-gold/20 pt-4 text-sm">
          <Row label="Subtotal" value={`₹${order.subtotal}`} />
          {order.discount > 0 && <Row label="Discount" value={`−₹${order.discount}`} />}
          <Row label="Shipping" value={order.shipping ? `₹${order.shipping}` : 'Free'} />
          <Row label="Total" value={`₹${order.total}`} bold />
          {order.paymentLabel && <Row label="Payment" value={order.paymentLabel} />}
        </div>
      </div>

      <div className="border border-gold/25 bg-white p-6">
        <h3 className="font-display text-lg text-ink">Delivery</h3>
        <p className="mt-2 text-sm text-ink">{order.customer.name}</p>
        <p className="text-sm text-ink-muted">{order.customer.phone}</p>
        <p className="mt-2 text-sm text-ink-muted">
          {order.customer.address ||
            [order.customer.line1, order.customer.line2, order.customer.city, order.customer.state, order.customer.pincode]
              .filter(Boolean)
              .join(', ')}
        </p>
        {order.customer.note && (
          <p className="mt-2 text-sm text-ink-muted">Note: {order.customer.note}</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-base font-semibold text-ink' : 'text-ink-muted'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const tone =
    status === 'Delivered'
      ? 'bg-success/15 text-success'
      : status === 'Cancelled'
        ? 'bg-error/15 text-error'
        : 'bg-gold/15 text-gold-muted';
  return (
    <span className={`inline-block rounded-sm px-2.5 py-1 text-xs font-medium ${tone}`}>{status}</span>
  );
}
