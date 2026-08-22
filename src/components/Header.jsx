import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const navLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/shop' },
  { label: 'Our story', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const content = useContent();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  function onSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d0c2] bg-[#faf6ee]/95 backdrop-blur-sm">
      <div className="page-wrap flex items-center justify-between gap-3 py-2.5 sm:py-4">
        <Link to="/" className="flex min-w-0 shrink items-center gap-2">
          <img
            src="/images/logo.png"
            alt="Daljheel Food Mart"
            className="h-9 w-9 shrink-0 rounded-full bg-black object-cover sm:h-11 sm:w-11"
          />
          <div className="min-w-0">
            <span className="font-display text-sm text-[#272c27] sm:text-lg">Daljheel </span>
            <span className="font-display text-sm text-[#9b4b35] sm:text-lg">Food Mart</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition hover:text-[#a6553b] ${isActive ? 'font-semibold text-[#24513f]' : 'text-[#6e6b62]'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <form onSubmit={onSearch} className="relative hidden xl:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77746d]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the pantry"
              className="w-52 border border-[#d8d0c2] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#24513f] xl:w-56"
            />
          </form>

          {/* Wishlist — hidden on mobile (accessible via bottom nav) */}
          <Link
            to="/account/wishlist"
            aria-label="Wishlist"
            className="relative hidden border border-[#d8d0c2] p-2 text-[#292e29] transition hover:bg-[#f1eadf] sm:block"
          >
            <Heart className="h-5 w-5" />
            {isAuthenticated && wishCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-purple-dark">
                {wishCount}
              </span>
            )}
          </Link>

          <Link
            to={isAuthenticated ? '/account' : '/login'}
            aria-label="Account"
            className="border border-[#d8d0c2] p-2 text-[#292e29] transition hover:bg-[#f1eadf]"
            title={isAuthenticated ? user?.name : 'Sign in'}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative border border-[#d8d0c2] p-2 text-[#292e29] transition hover:bg-[#f1eadf]"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] text-cream">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="border border-[#d8d0c2] p-2 text-[#292e29] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#d8d0c2] bg-[#faf6ee] px-4 py-4 lg:hidden">
          <form onSubmit={onSearch} className="mb-4">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saffron, dry fruits & more"
              className="w-full border border-[#d8d0c2] bg-white px-3 py-3 text-sm outline-none"
            />
          </form>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} onClick={() => setOpen(false)} className="text-sm text-ink">
                {link.label}
              </Link>
            ))}
            <Link to={isAuthenticated ? '/account' : '/login'} onClick={() => setOpen(false)} className="text-sm text-ink">
              {isAuthenticated ? 'My account' : 'Sign in'}
            </Link>
            {isAuthenticated && (
              <Link to="/account/wishlist" onClick={() => setOpen(false)} className="text-sm text-ink">
                Wishlist
              </Link>
            )}
            {content?.whatsappDigits && (
              <a href={`https://wa.me/${content.whatsappDigits}`} className="text-sm text-gold">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
