import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await updateProfile(form);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setMessage('');
    setUploading(true);
    try {
      await uploadAvatar(file);
      setMessage('Profile photo updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="border border-gold/25 bg-white p-6">
      <h2 className="font-display text-2xl text-ink">Profile</h2>
      <p className="mt-1 text-sm text-ink-muted">Manage your personal details and photo.</p>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gold/40 bg-cream">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-3xl text-purple">
                {(user?.name || 'D').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="btn-outline gap-2 px-4 py-2 text-sm"
          >
            <Camera className="h-4 w-4" />
            {uploading ? 'Uploading…' : 'Change photo'}
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 space-y-4">
          <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          {error && <p className="text-sm text-error">{error}</p>}
          {message && <p className="text-sm text-success">{message}</p>}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-gold/30 bg-cream-light/50 px-3 py-2.5 outline-none focus:border-gold focus:bg-white"
      />
    </label>
  );
}
