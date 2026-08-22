import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/account';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream-light via-cream to-[#efe6d6] py-14 lg:py-20">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-purple/10 blur-3xl" />
      <div className="page-wrap relative max-w-md">
        <p className="section-label mb-3">Welcome back</p>
        <h1 className="section-heading mb-2">Sign in</h1>
        <p className="mb-8 text-sm text-ink-muted">
          Access your orders, wishlist and saved addresses.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 border border-gold/25 bg-white/90 p-6 shadow-sm backdrop-blur">
          <Field
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Field
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          New to Daljheel?{' '}
          <Link to="/register" className="text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-gold/30 bg-white px-3 py-2.5 outline-none focus:border-gold"
      />
    </label>
  );
}
