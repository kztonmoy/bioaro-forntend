import Link from 'next/link';
import { getAllMarkers } from '@/lib/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatValue } from '@/lib/status';
import { Marker } from '@/lib/types';

export default async function AllResultsPage({ searchParams }: { searchParams: { status?: string; q?: string } }) {
  const all = await getAllMarkers();
  const status = searchParams.status;
  const q = searchParams.q?.toLowerCase();

  const filtered = all.filter((m) => {
    if (status && m.status !== status) return false;
    if (q && !m.name.toLowerCase().includes(q) && !m.abbreviation?.toLowerCase().includes(q)) return false;
    return true;
  });

  const byDomain = new Map<string, Marker[]>();
  for (const marker of filtered) {
    const arr = byDomain.get(marker.domainName) ?? [];
    arr.push(marker);
    byDomain.set(marker.domainName, arr);
  }

  const counts = {
    all: all.length,
    optimal: all.filter((m) => m.status === 'optimal').length,
    needs_attention: all.filter((m) => m.status === 'needs_attention').length,
    out_of_range: all.filter((m) => m.status === 'out_of_range').length,
  };

  const filters: { key?: string; label: string; count: number }[] = [
    { key: undefined, label: 'All', count: counts.all },
    { key: 'optimal', label: 'Optimal', count: counts.optimal },
    { key: 'needs_attention', label: 'Needs attention', count: counts.needs_attention },
    { key: 'out_of_range', label: 'Out of range', count: counts.out_of_range },
  ];

  return (
    <div>
      <PageHeader
        title="All results"
        subtitle="Every marker grouped by domain, with its reference interval, position in range, and status."
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.key ? `/results?status=${f.key}` : '/results'}
            className={`rounded-pill px-3 py-1.5 text-sm ${
              status === f.key || (!status && !f.key) ? 'bg-ink-900 text-white' : 'bg-cream-card border border-cream-line text-ink-900/70'
            }`}
          >
            {f.label} &middot; {f.count}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {[...byDomain.entries()].map(([domainName, markers]) => (
          <Card key={domainName} className="p-0 overflow-hidden">
            <div className="border-b border-cream-line bg-cream/60 px-5 py-3">
              <p className="text-sm font-semibold text-ink-900">
                {domainName} <span className="font-normal text-ink-900/50">&middot; {markers.length} markers</span>
              </p>
            </div>
            <div className="divide-y divide-cream-line">
              {markers.map((marker) => (
                <Link
                  key={marker.id}
                  href={`/results/markers/${marker.id}`}
                  className="grid grid-cols-2 items-center gap-2 px-5 py-3 text-sm hover:bg-cream/40 sm:grid-cols-4"
                >
                  <p className="font-medium text-ink-900">{marker.name}</p>
                  <p className="text-ink-900/70">{formatValue(marker.value, marker.unit)}</p>
                  <p className="hidden text-ink-900/50 sm:block">{marker.referenceText}</p>
                  <div className="flex justify-end sm:justify-start">
                    <StatusPill status={marker.status} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="text-center text-sm text-ink-900/60">No markers match this filter.</Card>
        )}
      </div>
    </div>
  );
}
