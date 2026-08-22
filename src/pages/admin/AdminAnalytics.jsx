import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { adminEngagement } from '../../api';
import { inr, PageHeader, Panel, Spinner, StatCard } from './adminUi';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminEngagement()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-error">{error}</p>;
  if (!data) return <Spinner />;

  const summary = data.summary || {
    activeCarts: 0,
    totalCartUnits: 0,
    wishlistsWithItems: 0,
    totalWishlistItems: 0,
  };
  const popularWishlist = data.popularWishlist || [];
  const popularCart = data.popularCart || [];
  const activity = data.activity || [];

  return (
    <div className="space-y-8">
      <PageHeader kicker="Engagement" title="Wishlist & Cart" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active carts" value={summary.activeCarts ?? 0} icon={ShoppingBag} />
        <StatCard label="Units in carts" value={summary.totalCartUnits ?? 0} icon={ShoppingBag} />
        <StatCard label="Wishlists" value={summary.wishlistsWithItems ?? 0} icon={Heart} />
        <StatCard label="Wishlist items" value={summary.totalWishlistItems ?? 0} icon={Heart} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductTable
          title="Most wishlisted"
          empty="No wishlist activity yet"
          rows={popularWishlist}
          valueKey="wishlistCount"
          valueLabel="Saves"
        />
        <ProductTable
          title="Most in carts"
          empty="No cart activity yet"
          rows={popularCart}
          valueKey="cartQty"
          valueLabel="Qty"
          secondaryKey="cartUsers"
          secondaryLabel="Users"
        />
      </div>

      <Panel title="Recent activity">
        <ul className="divide-y divide-gold/15">
          {activity.map((a, i) => (
            <li
              key={`${a.type}-${a.userId}-${i}`}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
            >
              <div>
                <p className="text-ink">
                  <span className="capitalize text-gold">{a.type}</span>
                  {' · '}
                  {a.userName}
                  {' · '}
                  {a.product}
                </p>
                <p className="text-xs text-ink-muted">{a.at ? new Date(a.at).toLocaleString() : ''}</p>
              </div>
              {a.userId && (
                <Link to={`/admin/users/${a.userId}`} className="text-xs text-gold hover:underline">
                  View user
                </Link>
              )}
            </li>
          ))}
          {activity.length === 0 && <li className="py-4 text-sm text-ink-muted">No engagement activity yet</li>}
        </ul>
      </Panel>
    </div>
  );
}

function ProductTable({ title, empty, rows, valueKey, valueLabel, secondaryKey, secondaryLabel }) {
  return (
    <Panel title={title}>
      <ul className="divide-y divide-gold/15">
        {rows.map((row) => (
          <li key={row.slug} className="flex items-center gap-3 py-3">
            {row.image && <img src={row.image} alt="" className="h-12 w-12 rounded-sm object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{row.name}</p>
              <p className="text-xs text-ink-muted">{inr(row.price)}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium text-ink">
                {row[valueKey]} {valueLabel}
              </p>
              {secondaryKey && (
                <p className="text-xs text-ink-muted">
                  {row[secondaryKey]} {secondaryLabel}
                </p>
              )}
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="py-4 text-sm text-ink-muted">{empty}</li>}
      </ul>
    </Panel>
  );
}
