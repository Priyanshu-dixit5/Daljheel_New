import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Wishlist & Cart', icon: Heart },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function onLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light via-cream to-[#efe8dc] text-ink">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gold/20 bg-purple-deep text-cream transition lg:static lg:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
            <img src="/images/logo.png" alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-gold/50" />
            <div>
              <p className="font-display text-sm text-gold">Daljheel</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-cream/60">Admin Panel</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {links.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-gold/20 text-gold'
                      : 'text-cream/70 hover:bg-white/5 hover:text-cream'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="shrink-0 border-t border-white/10 p-3">
            <a
              href="/"
              className="mb-1 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-cream/70 hover:bg-white/5 hover:text-cream"
            >
              <Store className="h-4 w-4" />
              View storefront
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-cream/70 hover:bg-white/5 hover:text-cream"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {open && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-purple-deep/50 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gold/20 bg-cream/90 px-4 backdrop-blur lg:px-8">
            <button
              type="button"
              className="rounded-sm p-2 text-ink lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <p className="hidden font-display text-lg text-ink sm:block">Operations</p>
            <div className="ml-auto text-right">
              <p className="text-sm font-medium text-ink">{user?.name}</p>
              <p className="text-xs text-ink-muted">{user?.email}</p>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
