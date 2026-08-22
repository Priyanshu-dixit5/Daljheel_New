import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { loginAdmin, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(location.state?.error || '');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await loginAdmin(form);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-purple-deep px-4">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-purple-light/30 blur-3xl" />
      <div className="relative w-full max-w-md border border-gold/30 bg-cream/95 p-8 shadow-xl backdrop-blur">
        <div className="mb-6 text-center">
          <img src="/images/logo.png" alt="" className="mx-auto h-14 w-14 rounded-full object-cover ring-1 ring-gold/40" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">Admin</p>
          <h1 className="font-display text-3xl text-ink">Daljheel Control</h1>
          <p className="mt-2 text-sm text-ink-muted">Secure access for store operations</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-ink">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-ink">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="admin-input"
            />
          </label>
          {error && <p className="text-sm text-error">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Sign in to Admin'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-ink-muted">
          Customer accounts cannot access this panel.{' '}
          <a href="/" className="text-gold hover:underline">
            Back to storefront
          </a>
        </p>
      </div>
    </div>
  );
}
