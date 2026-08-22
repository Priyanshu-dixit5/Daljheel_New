import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Package, Users, Truck, Heart, ShoppingBag } from 'lucide-react';
import { adminDashboard } from '../../api';
import { inr, PageHeader, Panel, Spinner, StatCard, StatusBadge } from './adminUi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminDashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const chart = useMemo(() => {
    if (!data?.salesChart) return [];
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return data.salesChart.slice(-14);
    }
    return data.salesChart;
  }, [data]);

  if (error) return <p className="text-error">{error}</p>;
  if (!data) return <Spinner />;

  const maxRevenue = Math.max(...chart.map((d) => d.revenue), 1);
  const cards = [
    { label: 'Revenue', value: inr(data.stats.revenue), icon: IndianRupee },
    { label: 'Orders', value: data.stats.orders, icon: Package },
    { label: 'Customers', value: data.stats.users, icon: Users },
    { label: 'Pending', value: data.stats.pendingOrders, icon: Truck },
    { label: 'In carts', value: data.stats.activeCartItems, icon: ShoppingBag },
    { label: 'Wishlisted', value: data.stats.wishlistItems, icon: Heart },
  ];

  return (
    <div className="space-y-8">
      <PageHeader kicker="Overview" title="Dashboard" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon }) => (
          <StatCard key={label} label={label} value={value} icon={icon} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Sales · last 30 days">
          <div className="mt-2 flex h-48 items-end gap-1">
            {chart.map((day) => (
              <div key={day.date} className="group relative flex flex-1 flex-col justify-end">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-purple to-gold/80 transition group-hover:from-purple-light"
                  style={{ height: `${Math.max(4, (day.revenue / maxRevenue) * 100)}%` }}
                  title={`${day.date}: ${inr(day.revenue)} · ${day.orders} orders`}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-ink-muted">
            <span>{chart[0]?.date}</span>
            <span>{chart[chart.length - 1]?.date}</span>
          </div>
        </Panel>

        <Panel title="Order status">
          <ul className="space-y-2">
            {data.statusBreakdown
              .filter((s) => s.count > 0)
              .map((s) => (
                <li key={s.status} className="flex items-center justify-between text-sm">
                  <StatusBadge status={s.status} />
                  <span className="font-medium text-ink">{s.count}</span>
                </li>
              ))}
            {data.statusBreakdown.every((s) => s.count === 0) && (
              <li className="text-sm text-ink-muted">No orders yet</li>
            )}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Recent orders"
          action={
            <Link to="/admin/orders" className="text-sm text-gold hover:underline">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-gold/15">
            {data.recentOrders.map((o) => (
              <li key={o.orderCode} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <Link to={`/admin/orders/${o.orderCode}`} className="font-medium text-ink hover:text-gold">
                    {o.orderCode}
                  </Link>
                  <p className="text-xs text-ink-muted">{o.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{inr(o.total)}</p>
                  <p className="text-xs text-ink-muted">{o.status}</p>
                </div>
              </li>
            ))}
            {data.recentOrders.length === 0 && (
              <li className="py-4 text-sm text-ink-muted">No recent orders</li>
            )}
          </ul>
        </Panel>

        <Panel title="Recent activity">
          <ul className="space-y-3">
            {data.recentActivity.slice(0, 10).map((a, i) => (
              <li key={`${a.type}-${a.ref}-${i}`} className="text-sm">
                <p className="text-ink">{a.label}</p>
                <p className="text-xs text-ink-muted">{a.at ? new Date(a.at).toLocaleString() : ''}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {data.recentUsers?.length > 0 && (
        <Panel
          title="New customers"
          action={
            <Link to="/admin/users" className="text-sm text-gold hover:underline">
              Manage users
            </Link>
          }
        >
          <ul className="divide-y divide-gold/15">
            {data.recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <Link to={`/admin/users/${u.id}`} className="font-medium text-ink hover:text-gold">
                    {u.name}
                  </Link>
                  <p className="text-xs text-ink-muted">{u.email}</p>
                </div>
                <p className="text-xs text-ink-muted">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
