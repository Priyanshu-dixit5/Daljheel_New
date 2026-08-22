import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { fetchDashboard } from '../../api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Dashboard() {
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, [cartCount, wishCount]);

  if (error) {
    return <p className="text-error">{error}</p>;
  }

  if (!data) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
      </div>
    );
  }

  const statsData = data.stats || {
    orders: data.orders?.length ?? 0,
    wishlist: data.wishlistCount ?? wishCount,
    cart: data.cartCount ?? cartCount,
    addresses: data.addressCount ?? 0,
  };
  const recentOrders = data.recentOrders || (Array.isArray(data.orders) ? data.orders.slice(0, 5) : []);

  const stats = [
    { label: 'Orders', value: statsData.orders ?? 0, to: '/account/orders', icon: Package },
    { label: 'Wishlist', value: statsData.wishlist ?? 0, to: '/account/wishlist', icon: Heart },
    { label: 'Cart items', value: statsData.cart ?? 0, to: '/cart', icon: ShoppingBag },
    { label: 'Addresses', value: statsData.addresses ?? 0, to: '/account/addresses', icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="group border border-gold/25 bg-white p-5 transition hover:border-gold hover:shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <Icon className="h-5 w-5 text-gold" />
              <ArrowRight className="h-4 w-4 text-ink-muted opacity-0 transition group-hover:opacity-100" />
            </div>
            <p className="font-display text-3xl text-ink">{value}</p>
            <p className="mt-1 text-sm text-ink-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="border border-gold/25 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent orders</h2>
          <Link to="/account/orders" className="text-sm text-gold hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No orders yet.{' '}
            <Link to="/shop" className="text-gold hover:underline">
              Start shopping
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-gold/15">
            {recentOrders.map((order) => (
              <li key={order.orderCode} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link to={`/account/orders/${order.orderCode}`} className="font-medium text-ink hover:text-gold">
                    {order.orderCode}
                  </Link>
                  <p className="text-xs text-ink-muted">
                    {new Date(order.createdAt).toLocaleDateString()} ·{' '}
                    {order.itemCount ?? order.items?.length ?? 0} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-ink">₹{order.total}</p>
                  <StatusPill status={order.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/shop" className="btn-primary">
          Continue shopping
        </Link>
        <Link to="/checkout" className="btn-gold">
          Go to checkout
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const tone =
    status === 'Delivered'
      ? 'bg-success/15 text-success'
      : status === 'Cancelled'
        ? 'bg-error/15 text-error'
        : 'bg-gold/15 text-gold-muted';
  return (
    <span className={`mt-1 inline-block rounded-sm px-2 py-0.5 text-[11px] font-medium ${tone}`}>
      {status}
    </span>
  );
}
