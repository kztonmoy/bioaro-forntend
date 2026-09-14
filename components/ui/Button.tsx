import { clsx } from 'clsx';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800',
  secondary: 'bg-white text-ink-900 border border-cream-line hover:bg-cream',
  danger: 'bg-status-elevatedBg text-status-elevated border border-status-elevated/30 hover:bg-status-elevated/10',
};

export function Button({
  children,
  variant = 'primary',
  href,
  className,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition-colors',
    variants[variant],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
