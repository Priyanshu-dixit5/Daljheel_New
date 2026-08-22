export function PageHeader({ kicker, title, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{kicker}</p>
        <h1 className="font-display text-3xl text-ink md:text-4xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
    </div>
  );
}

export function Panel({ title, action, children }) {
  return (
    <div className="admin-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="admin-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-gold" />}
      </div>
      <p className="font-display text-3xl text-ink">{value}</p>
    </div>
  );
}

export function StatusBadge({ status }) {
  const tone =
    status === 'Delivered' || status === 'Active'
      ? 'bg-success/15 text-success'
      : status === 'Cancelled' || status === 'Inactive'
        ? 'bg-error/15 text-error'
        : status === 'Pending'
          ? 'bg-warning/15 text-warning'
          : 'bg-gold/15 text-gold-muted';
  return <span className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${tone}`}>{status}</span>;
}

export function inr(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}
