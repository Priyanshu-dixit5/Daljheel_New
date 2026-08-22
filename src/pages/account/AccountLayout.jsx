import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/account', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/');
  }

  return (
    <section className="bg-gradient-to-b from-cream-light to-cream py-10 lg:py-14">
      <div className="page-wrap">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label mb-2">Your account</p>
            <h1 className="font-display text-3xl text-ink md:text-4xl">
              Namaskar, {user?.name?.split(' ')[0] || 'guest'}
            </h1>
          </div>
          <button type="button" onClick={onLogout} className="btn-outline gap-2 text-sm">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit border border-gold/25 bg-white/80 p-3 backdrop-blur">
            <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {links.map(({ to, end, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 rounded-sm px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-purple text-cream'
                        : 'text-ink-muted hover:bg-cream hover:text-ink'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}
