import { clsx } from 'clsx';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx('rounded-card bg-cream-card border border-cream-line shadow-card p-5', className)}>
      {children}
    </div>
  );
}
