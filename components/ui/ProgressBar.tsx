import { clsx } from 'clsx';
import { MarkerStatus } from '@/lib/types';
import { STATUS_CLASSES } from '@/lib/status';

export function ProgressBar({
  position,
  status,
  className,
}: {
  position?: number;
  status: MarkerStatus;
  className?: string;
}) {
  const c = STATUS_CLASSES[status];
  const pct = position === undefined ? 0 : Math.min(Math.max(position, 0), 1) * 100;
  return (
    <div className={clsx('relative h-1.5 w-full rounded-pill bg-cream-line', className)}>
      <div className="absolute inset-y-0 left-0 rounded-pill bg-status-optimalBg" style={{ width: '100%' }} />
      <div
        className={clsx('absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ring-2 ring-white', c.dot)}
        style={{ left: `calc(${pct}% - 5px)` }}
      />
    </div>
  );
}
