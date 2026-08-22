import { useEffect, useState } from 'react';
import { adminChangePassword, adminGetSettings, adminSaveSettings } from '../../api';
import { PageHeader, Spinner } from './adminUi';

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [carriersText, setCarriersText] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    adminGetSettings()
      .then((res) => {
        setForm(res.settings);
        setCarriersText((res.settings.shippingCarriers || []).join('\n'));
      })
      .catch((err) => setError(err.message));
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const payload = {
        ...form,
        shippingCarriers: carriersText
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
        freeShippingThreshold: Number(form.freeShippingThreshold),
        flatShipping: Number(form.flatShipping),
      };
      const res = await adminSaveSettings(payload);
      setForm(res.settings);
      setCarriersText((res.settings.shippingCarriers || []).join('\n'));
      setMessage('Settings saved. Storefront contact fields synced where applicable.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function onPassword(e) {
    e.preventDefault();
    setPwMessage('');
    setPwError('');
    if (pw.newPassword !== pw.confirm) {
      setPwError('New passwords do not match');
      return;
    }
    setPwSaving(true);
    try {
      await adminChangePassword({
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      setPwMessage('Admin password updated');
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  }

  if (error && !form) return <p className="text-error">{error}</p>;
  if (!form) return <Spinner />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader kicker="Configuration" title="Settings" />

      <form onSubmit={onSubmit} className="admin-card space-y-6 p-6">
        <Section title="Store identity">
          <Field label="Store name" value={form.storeName} onChange={(v) => setForm({ ...form, storeName: v })} />
          <Field label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
        </Section>

        <Section title="Support & WhatsApp">
          <Field
            label="Support email"
            type="email"
            value={form.supportEmail}
            onChange={(v) => setForm({ ...form, supportEmail: v })}
          />
          <Field
            label="Support phone"
            value={form.supportPhone}
            onChange={(v) => setForm({ ...form, supportPhone: v })}
          />
          <Field
            label="WhatsApp digits (with country code)"
            value={form.whatsappDigits}
            onChange={(v) => setForm({ ...form, whatsappDigits: v })}
          />
        </Section>

        <Section title="Shipping economics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Free shipping threshold (₹)"
              type="number"
              value={form.freeShippingThreshold}
              onChange={(v) => setForm({ ...form, freeShippingThreshold: v })}
            />
            <Field
              label="Flat shipping (₹)"
              type="number"
              value={form.flatShipping}
              onChange={(v) => setForm({ ...form, flatShipping: v })}
            />
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-ink">Shipping carriers (one per line)</span>
            <textarea
              rows={5}
              value={carriersText}
              onChange={(e) => setCarriersText(e.target.value)}
              className="admin-input bg-cream-light/40"
            />
          </label>
        </Section>

        <Section title="Locale">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} />
            <Field label="Timezone" value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} />
          </div>
        </Section>

        {message && <p className="text-sm text-success">{message}</p>}
        {error && <p className="text-sm text-error">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>

      <form onSubmit={onPassword} className="admin-card space-y-4 p-6">
        <h2 className="font-display text-lg text-ink">Admin security</h2>
        <p className="text-sm text-ink-muted">Change the password for the signed-in admin account.</p>
        <Field
          label="Current password"
          type="password"
          value={pw.currentPassword}
          onChange={(v) => setPw({ ...pw, currentPassword: v })}
        />
        <Field
          label="New password"
          type="password"
          value={pw.newPassword}
          onChange={(v) => setPw({ ...pw, newPassword: v })}
        />
        <Field
          label="Confirm new password"
          type="password"
          value={pw.confirm}
          onChange={(v) => setPw({ ...pw, confirm: v })}
        />
        {pwMessage && <p className="text-sm text-success">{pwMessage}</p>}
        {pwError && <p className="text-sm text-error">{pwError}</p>}
        <button type="submit" disabled={pwSaving} className="btn-primary">
          {pwSaving ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4 border-b border-gold/15 pb-6 last:border-0 last:pb-0">
      <h2 className="font-display text-lg text-ink">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink">{label}</span>
      <input
        type={type}
        required
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input bg-cream-light/40"
      />
    </label>
  );
}
