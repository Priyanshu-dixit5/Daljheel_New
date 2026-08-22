import { Navigate, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirm from './pages/OrderConfirm';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountLayout from './pages/account/AccountLayout';
import Dashboard from './pages/account/Dashboard';
import Profile from './pages/account/Profile';
import WishlistPage from './pages/account/Wishlist';
import Orders from './pages/account/Orders';
import Addresses from './pages/account/Addresses';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="orders/*" element={<Navigate to="/admin" replace />} />
        <Route path="shipping/*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:slug" element={<Product />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order/:orderCode" element={<OrderConfirm />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderCode" element={<Orders />} />
          <Route path="addresses" element={<Addresses />} />
        </Route>
      </Route>
    </Routes>
  );
}
