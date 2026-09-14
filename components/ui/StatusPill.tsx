import { clsx } from 'clsx';
import { MarkerStatus } from '@/lib/types';
import { STATUS_CLASSES, STATUS_LABEL } from '@/lib/status';

export function StatusPill({ status, className }: { status: MarkerStatus; className?: string }) {
  const c = STATUS_CLASSES[status];
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium', c.bg, c.text, className)}>
      <span className={clsx('h-1.5 w-1.5 rounded-full', c.dot)} />
      {STATUS_LABEL[status]}
    </span>
  );
}
