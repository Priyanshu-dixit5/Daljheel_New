import { Outlet, Link, useLocation } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import { Heart, Home, Search, ShoppingBag, Tags } from 'lucide-react';

export default function Layout() {
  const { pathname } = useLocation();

  function navClass(to) {
    const active = pathname === to || (to !== '/' && pathname.startsWith(to));
    return `flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
      active ? 'text-[#9b4b35]' : 'text-[#69675f]'
    }`;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      {/* Bottom navigation — mobile only */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-[#ded7cb] bg-[#fffcf6] px-2 py-1.5 shadow-[0_-4px_18px_rgba(36,81,63,0.08)] lg:hidden">
        <Link to="/" className={navClass('/')}>
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link to="/shop" className={navClass('/shop')}>
          <Tags className="h-5 w-5" />
          <span>Categories</span>
        </Link>
        <Link to="/shop?search=" className={navClass('/shop?search=')}>
          <Search className="h-5 w-5" />
          <span>Search</span>
        </Link>
        <Link to="/account/wishlist" className={navClass('/account/wishlist')}>
          <Heart className="h-5 w-5" />
          <span>Wishlist</span>
        </Link>
        <Link to="/cart" className={navClass('/cart')}>
          <ShoppingBag className="h-5 w-5" />
          <span>Cart</span>
        </Link>
      </nav>
    </div>
  );
}
