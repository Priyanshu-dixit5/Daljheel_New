import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminUpdateUser, adminUser, adminUsers } from '../../api';
import { inr, PageHeader, Panel, Spinner, StatCard, StatusBadge } from './adminUi';

export default function AdminUsers() {
  const { id } = useParams();
  if (id) return <UserDetail id={id} />;
  return <UserList />;
}

function UserList() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      adminUsers({ q, status })
        .then(setData)
        .catch((err) => setError(err.message));
    }, 200);
    return () => clearTimeout(t);
  }, [q, status]);

  return (
    <div className="space-y-6">
      <PageHeader kicker="Customers" title="Users" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone…"
          className="admin-input flex-1"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input sm:w-44">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="text-error">{error}</p>}
      {!data ? (
        <Spinner />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {data.users.map((u) => (
              <Link key={u.id} to={`/admin/users/${u.id}`} className="admin-card block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{u.name}</p>
                    <p className="text-xs text-ink-muted">{u.email}</p>
                  </div>
                  <StatusBadge status={u.isActive !== false ? 'Active' : 'Inactive'} />
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  {u.orderCount ?? 0} orders · {inr(u.totalSpent ?? 0)}
                </p>
              </Link>
            ))}
            {data.users.length === 0 && <p className="py-8 text-center text-ink-muted">No users found</p>}
          </div>

          <div className="admin-card hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gold/20 bg-cream/60 text-xs uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Spent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {data.users.map((u) => (
                  <tr key={u.id} className="hover:bg-cream/40">
                    <td className="px-4 py-3">
                      <Link to={`/admin/users/${u.id}`} className="font-medium text-ink hover:text-gold">
                        {u.name}
                      </Link>
                      <p className="text-xs text-ink-muted">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">{u.orderCount ?? 0}</td>
                    <td className="px-4 py-3">{inr(u.totalSpent ?? 0)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.isActive !== false ? 'Active' : 'Inactive'} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                      No users found
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

function UserDetail({ id }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });

  function load() {
    adminUser(id)
      .then((res) => {
        setData(res);
        setProfile({
          name: res.user.name || '',
          email: res.user.email || '',
          phone: res.user.phone || '',
        });
      })
      .catch((err) => setError(err.message));
  }

  useEffect(load, [id]);

  async function toggleActive() {
    setBusy(true);
    setMessage('');
    try {
      const res = await adminUpdateUser(id, { isActive: !(data.user.isActive !== false) });
      setData((d) => ({ ...d, user: res.user }));
      setMessage(res.user.isActive ? 'User activated' : 'User deactivated');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const res = await adminUpdateUser(id, profile);
      setData((d) => ({ ...d, user: res.user }));
      setMessage('Profile updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !data) return <p className="text-error">{error}</p>;
  if (!data) return <Spinner />;

  const {
    user,
    orders = [],
    addresses = [],
    stats = { orderCount: 0, totalSpent: 0 },
    cartItems = [],
    wishlistItems = [],
  } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/users" className="text-sm text-gold hover:underline">
          ← All users
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-gold/40 bg-cream font-display text-2xl text-purple">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                user.name?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl text-ink">{user.name}</h1>
              <p className="text-sm text-ink-muted">
                {user.email} · {user.phone}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={toggleActive}
            className={user.isActive !== false ? 'btn-outline' : 'btn-primary'}
          >
            {user.isActive !== false ? 'Deactivate' : 'Activate'}
          </button>
        </div>
        {message && <p className="mt-2 text-sm text-success">{message}</p>}
        {error && data && <p className="mt-2 text-sm text-error">{error}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders" value={stats.orderCount} />
        <StatCard label="Total spent" value={inr(stats.totalSpent)} />
        <StatCard label="Account" value={user.isActive !== false ? 'Active' : 'Inactive'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Profile">
          <form onSubmit={saveProfile} className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-ink-muted">Name</span>
              <input
                className="admin-input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-ink-muted">Email</span>
              <input
                type="email"
                className="admin-input"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-ink-muted">Phone</span>
              <input
                className="admin-input"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
              />
            </label>
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </Panel>

        <>{false && <Panel title="Order history">
          <ul className="divide-y divide-gold/15">
            {orders.map((o) => (
              <li key={o.orderCode} className="flex justify-between py-3 text-sm">
                <Link to={`/admin/orders/${o.orderCode}`} className="text-ink hover:text-gold">
                  {o.orderCode}
                </Link>
                <span>
                  {inr(o.total)} · {o.status}
                </span>
              </li>
            ))}
            {orders.length === 0 && <li className="py-3 text-sm text-ink-muted">No orders</li>}
          </ul>
        </Panel>}</>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Addresses">
          <ul className="space-y-3 text-sm">
            {addresses.map((a) => (
              <li key={a.id} className="text-ink-muted">
                <span className="font-medium text-ink">{a.label}</span>
                {a.isDefault && <span className="ml-2 text-xs text-gold">Default</span>}
                <p>{[a.line1, a.city, a.state, a.pincode].filter(Boolean).join(', ')}</p>
              </li>
            ))}
            {addresses.length === 0 && <li className="text-ink-muted">No saved addresses</li>}
          </ul>
        </Panel>
        <Panel title="Engagement">
          <p className="text-sm text-ink-muted">Cart items: {cartItems.length}</p>
          <p className="mt-1 text-sm text-ink-muted">Wishlist items: {wishlistItems.length}</p>
        </Panel>
      </div>
    </div>
  );
}
