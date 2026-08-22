import { useEffect, useState } from 'react';
import { MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from '../../api';

const emptyForm = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setAddresses(await fetchAddresses());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditing('new');
    setForm(emptyForm);
    setError('');
  }

  function startEdit(addr) {
    setEditing(addr.id);
    setForm({
      label: addr.label || 'Home',
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setError('');
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing === 'new') {
        await createAddress(form);
      } else {
        await updateAddress(editing, form);
      }
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this address?')) return;
    await deleteAddress(id);
    await load();
  }

  async function onDefault(id) {
    await setDefaultAddress(id);
    await load();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-ink">Addresses</h2>
          <p className="mt-1 text-sm text-ink-muted">Save delivery locations for faster checkout.</p>
        </div>
        {!editing && (
          <button type="button" onClick={startCreate} className="btn-primary gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Add address
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={onSubmit} className="space-y-4 border border-gold/25 bg-white p-6">
          <h3 className="font-display text-lg text-ink">
            {editing === 'new' ? 'New address' : 'Edit address'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Label" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
            <Field label="Full name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Phone" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field
              label="Pincode"
              required
              value={form.pincode}
              onChange={(v) => setForm({ ...form, pincode: v })}
            />
            <div className="sm:col-span-2">
              <Field label="Address line 1" required value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Address line 2" value={form.line2} onChange={(v) => setForm({ ...form, line2: v })} />
            </div>
            <Field label="City" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="State" required value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            Set as default address
          </label>
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save address'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !editing ? (
        <div className="border border-gold/25 bg-white p-10 text-center">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-gold" />
          <p className="text-ink-muted">No saved addresses yet.</p>
          <button type="button" onClick={startCreate} className="btn-primary mt-4">
            Add your first address
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <li key={addr.id} className="border border-gold/25 bg-white p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{addr.label}</p>
                  {addr.isDefault && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-gold">
                      <Star className="h-3 w-3 fill-gold" /> Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Edit"
                    onClick={() => startEdit(addr)}
                    className="rounded-sm p-2 text-ink-muted hover:bg-cream hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete"
                    onClick={() => onDelete(addr.id)}
                    className="rounded-sm p-2 text-ink-muted hover:bg-cream hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-ink">{addr.name}</p>
              <p className="text-sm text-ink-muted">{addr.phone}</p>
              <p className="mt-2 text-sm text-ink-muted">
                {[addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
              </p>
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => onDefault(addr.id)}
                  className="mt-4 text-sm text-gold hover:underline"
                >
                  Set as default
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({ label, value, onChange, required }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-gold/30 bg-cream-light/40 px-3 py-2 outline-none focus:border-gold focus:bg-white"
      />
    </label>
  );
}
