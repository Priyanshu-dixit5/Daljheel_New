import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream-light via-cream to-[#efe6d6] py-14 lg:py-20">
      <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-purple/10 blur-3xl" />
      <div className="page-wrap relative max-w-md">
        <p className="section-label mb-3">Join Daljheel</p>
        <h1 className="section-heading mb-2">Create account</h1>
        <p className="mb-8 text-sm text-ink-muted">
          Save your favourites, track orders and checkout faster.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 border border-gold/25 bg-white/90 p-6 shadow-sm backdrop-blur">
          <Field label="Full name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Field
            label="Phone"
            required
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Field
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />
          <p className="text-xs text-ink-muted">Password must be at least 6 characters.</p>
          {error && <p className="text-sm text-error">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline">
            Sign in
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
