import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { adminCreateProduct, adminDeleteProduct, adminProducts, adminUpdateProduct } from '../../api';
import { PageHeader, Panel, Spinner } from './adminUi';

const emptyProduct = { name: '', slug: '', category: 'dry-fruits', price: '', mrp: '', size: '', image: '/images/saffron.png', description: '', isAvailable: true };

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function load() { adminProducts().then((data) => setProducts(data.products || [])).catch((err) => setError(err.message)); }
  useEffect(load, []);
  function startCreate() { setEditing('new'); setForm(emptyProduct); setError(''); setMessage(''); }
  function startEdit(product) { setEditing(product.slug); setForm({ ...emptyProduct, ...product }); setError(''); setMessage(''); }
  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); }

  async function saveProduct(e) {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { ...form, price: Number(form.price), mrp: Number(form.mrp) };
    try {
      if (editing === 'new') await adminCreateProduct(payload); else await adminUpdateProduct(editing, payload);
      setMessage(editing === 'new' ? 'Product added.' : 'Product updated.');
      setEditing(null); setForm(emptyProduct); load();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function removeProduct(product) {
    if (!window.confirm(`Remove ${product.name}? This cannot be undone.`)) return;
    setError('');
    try { await adminDeleteProduct(product.slug); setMessage('Product removed.'); load(); } catch (err) { setError(err.message); }
  }

  if (!products) return <Spinner />;
  return <div className="space-y-6"><PageHeader kicker="Catalog" title="Products"><button type="button" onClick={startCreate} className="btn-primary"><Plus className="h-4 w-4" /> Add product</button></PageHeader>{message && <p className="text-sm text-success">{message}</p>}{error && <p className="text-sm text-error">{error}</p>}{editing && <Panel title={editing === 'new' ? 'Add product' : 'Edit product'}><ProductForm form={form} update={update} saving={saving} onSubmit={saveProduct} onCancel={() => setEditing(null)} /></Panel>}<Panel title="All products"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-gold/20 text-xs uppercase tracking-wider text-ink-muted"><tr><th className="px-3 py-3">Product</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Price</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-gold/10"><td className="px-3 py-3"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-10 w-10 rounded-sm border border-gold/20 bg-cream object-cover" /><div><p className="font-medium text-ink">{product.name}</p><p className="text-xs text-ink-muted">{product.size || product.slug}</p></div></div></td><td className="px-3 py-3 capitalize">{product.category}</td><td className="px-3 py-3">₹{product.price}</td><td className="px-3 py-3"><span className={product.isAvailable ? 'text-success' : 'text-error'}>{product.isAvailable ? 'Available' : 'Hidden'}</span></td><td className="px-3 py-3"><div className="flex gap-2"><button type="button" onClick={() => startEdit(product)} className="rounded-sm border border-gold/30 p-2 text-ink hover:border-gold"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => removeProduct(product)} className="rounded-sm border border-gold/30 p-2 text-error hover:border-error"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div></Panel></div>;
}

function ProductForm({ form, update, saving, onSubmit, onCancel }) {
  return <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2"><Field label="Product name" value={form.name} onChange={(value) => update('name', value)} required /><Field label="Slug" value={form.slug} onChange={(value) => update('slug', value)} required /><Field label="Category" value={form.category} onChange={(value) => update('category', value)} required /><Field label="Variant / size" value={form.size} onChange={(value) => update('size', value)} /><Field label="Price" type="number" value={form.price} onChange={(value) => update('price', value)} required /><Field label="MRP" type="number" value={form.mrp} onChange={(value) => update('mrp', value)} required /><Field label="Image path or URL" value={form.image} onChange={(value) => update('image', value)} required /><label className="flex items-center gap-2 self-end text-sm text-ink"><input type="checkbox" checked={form.isAvailable} onChange={(e) => update('isAvailable', e.target.checked)} /> Available on storefront</label><label className="md:col-span-2"><span className="mb-1 block text-sm text-ink">Description</span><textarea required rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} className="admin-input" /></label><div className="flex gap-3 md:col-span-2"><button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save product'}</button><button type="button" onClick={onCancel} className="btn-outline">Cancel</button></div></form>;
}

function Field({ label, type = 'text', value, onChange, required }) { return <label><span className="mb-1 block text-sm text-ink">{label}</span><input type={type} min={type === 'number' ? '0' : undefined} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" /></label>; }
