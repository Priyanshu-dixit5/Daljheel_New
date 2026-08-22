import { useEffect, useState } from 'react';
import { Heart, ShoppingBag, Users } from 'lucide-react';
import { adminDashboard } from '../../api';
import { PageHeader, Panel, Spinner, StatCard } from './adminUi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { adminDashboard().then(setData).catch((err) => setError(err.message)); }, []);
  if (error) return <p className="text-error">{error}</p>;
  if (!data) return <Spinner />;

  const cards = [
    { label: 'Customers', value: data.stats.users, icon: Users },
    { label: 'In carts', value: data.stats.activeCartItems, icon: ShoppingBag },
    { label: 'Wishlisted', value: data.stats.wishlistItems, icon: Heart },
  ];

  return <div className="space-y-8"><PageHeader kicker="Overview" title="Dashboard" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ label, value, icon }) => <StatCard key={label} label={label} value={value} icon={icon} />)}</div><div className="grid gap-6 lg:grid-cols-2"><Panel title="Recent activity"><ul className="space-y-3">{data.recentActivity.slice(0, 10).map((a, i) => <li key={`${a.type}-${a.ref}-${i}`} className="text-sm"><p className="text-ink">{a.label}</p><p className="text-xs text-ink-muted">{a.at ? new Date(a.at).toLocaleString() : ''}</p></li>)}</ul></Panel>{data.recentUsers?.length > 0 && <Panel title="New customers"><ul className="divide-y divide-gold/15">{data.recentUsers.map((u) => <li key={u.id} className="flex items-center justify-between py-3 text-sm"><div><p className="font-medium text-ink">{u.name}</p><p className="text-xs text-ink-muted">{u.email}</p></div><p className="text-xs text-ink-muted">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</p></li>)}</ul></Panel>}</div></div>;
}
