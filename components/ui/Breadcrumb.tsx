import Link from 'next/link';

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-ink-900/60">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="hover:text-ink-900">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-900">{item.label}</span>
          )}
          {i < items.length - 1 && <span aria-hidden>/</span>}
        </span>
      ))}
    </nav>
  );
}
