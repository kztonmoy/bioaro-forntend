export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-ink-900/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
