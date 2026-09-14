import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDomainView } from '@/lib/api';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatValue, DOMAIN_STATUS_LABEL } from '@/lib/status';
import { Button } from '@/components/ui/Button';

export default async function DomainPage({ params }: { params: { slug: string } }) {
  const { domain, markers } = await getDomainView(params.slug);
  if (!domain) notFound();

  const sorted = [...markers].sort((a, b) => {
    const da = a.positionInRange === undefined ? 0 : Math.min(a.positionInRange, 1 - a.positionInRange);
    const db = b.positionInRange === undefined ? 0 : Math.min(b.positionInRange, 1 - b.positionInRange);
    return da - db;
  });

  return (
    <div>
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'All results', href: '/results' }, { label: domain.name }]} />
      </div>

      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{domain.name}</p>
          {domain.description && <p className="mt-2 max-w-xl text-sm text-ink-900/70">{domain.description}</p>}
        </div>
        <div className="text-right">
          <StatusPill status={domain.status === 'elevated' ? 'out_of_range' : domain.status === 'watch' ? 'needs_attention' : 'optimal'} />
          <p className="mt-2 font-display text-xl font-semibold text-ink-900">
            {domain.markersInRange} / {domain.markersTotal}
          </p>
          <p className="text-xs text-ink-900/50">in range</p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((marker) => (
          <Link key={marker.id} href={`/results/markers/${marker.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="flex items-baseline justify-between">
                <p className="font-medium text-ink-900">{marker.name}</p>
                <p className="text-sm font-medium text-ink-900">{formatValue(marker.value, marker.unit)}</p>
              </div>
              <ProgressBar position={marker.positionInRange} status={marker.status} className="mt-3" />
              <p className="mt-1.5 text-xs text-ink-900/50">{marker.referenceText}</p>
              {marker.interpretation && <p className="mt-2 text-sm text-ink-900/70">{marker.interpretation}</p>}
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-medium text-ink-900">Track this domain over time</p>
          <p className="mt-1 text-sm text-ink-900/60">
            A repeat panel in three to six months turns these markers into trend lines.
          </p>
        </div>
        <Button href="/trends">View trends &rarr;</Button>
      </Card>
    </div>
  );
}
