import { notFound } from 'next/navigation';
import { getMarkerDetail, getMarkerTrend } from '@/lib/api';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatValue } from '@/lib/status';
import { Button } from '@/components/ui/Button';

export default async function MarkerDetailPage({ params }: { params: { id: string } }) {
  const marker = await getMarkerDetail(params.id);
  if (!marker) notFound();
  const trend = await getMarkerTrend(params.id);

  const worrying = marker.status === 'out_of_range' && !!marker.companionNote;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: 'All results', href: '/results' },
            { label: marker.domainName, href: `/results/domains/${marker.domainSlug}` },
            { label: marker.name },
          ]}
        />
      </div>

      {worrying && (
        <Card className="mb-6 border-status-watch/30 bg-status-watchBg">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-status-watch" />
            <div>
              <p className="font-medium text-ink-900">This result is outside its reference interval</p>
              <p className="mt-1 text-sm text-ink-900/70">
                Your {marker.name} came back at {formatValue(marker.value, marker.unit)}, {marker.referenceText}. That
                is a signal to follow up &mdash; it is not a diagnosis, and it cannot be read on its own.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button>Talk to a BioAro clinician</Button>
                <Button variant="secondary" href="/sharing">Share with my own doctor</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-display text-xl font-semibold text-ink-900">{marker.name}</p>
          <p className="text-sm text-ink-900/50">{marker.abbreviation ?? marker.name} &middot; {marker.domainName}</p>
          <p className="mt-4 font-display text-3xl font-semibold text-ink-900">
            {formatValue(marker.value, marker.unit)}
          </p>
          <div className="mt-2">
            <StatusPill status={marker.status} />
          </div>
        </div>
        <div className="text-right text-xs text-ink-900/50">
          <p className="uppercase tracking-wide">Reference interval</p>
          <p className="mb-3 font-medium text-ink-900">{marker.referenceText}</p>
          <p className="uppercase tracking-wide">Collected</p>
          <p className="font-medium text-ink-900">9 Feb 2026</p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="font-display text-base font-semibold text-ink-900">What this test measures</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-900/70">
            {marker.interpretation ?? 'No further explanation is available for this marker yet.'}
          </p>
          {marker.companionNote && (
            <p className="mt-3 rounded-card bg-cream p-3 text-sm text-ink-900/70">{marker.companionNote}</p>
          )}
        </Card>

        <Card>
          <p className="font-display text-base font-semibold text-ink-900">Over time</p>
          {trend.length > 0 ? (
            <div className="mt-3 flex items-end gap-4">
              {trend.map((point) => (
                <div key={point.date} className="flex flex-col items-center gap-1">
                  <p className="text-xs text-ink-900/50">{point.date}</p>
                  <p className="text-sm font-medium text-ink-900">{point.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-ink-900/60">
              A second panel will draw a trend line here. A single reading shows position, not direction.
            </p>
          )}
        </Card>
      </div>

      {marker.bands && (
        <Card className="mt-6 p-0 overflow-hidden">
          <div className="border-b border-cream-line px-5 py-3">
            <p className="font-display text-base font-semibold text-ink-900">How this result is interpreted</p>
          </div>
          <div className="divide-y divide-cream-line">
            {marker.bands.map((band) => {
              const active = marker.value !== null && band.range.includes('<') && marker.value < parseFloat(band.range.replace(/[^0-9.]/g, ''));
              return (
                <div key={band.label} className={`grid grid-cols-3 gap-4 px-5 py-3 text-sm ${active ? 'bg-status-optimalBg' : ''}`}>
                  <p className="font-medium text-ink-900">{band.label}</p>
                  <p className="text-ink-900/60">{band.range}</p>
                  <p className="text-ink-900/60">{band.meaning}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="mt-6 bg-cream">
        <p className="font-display text-sm font-semibold text-ink-900">Before you read too much into this number</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-900/70">
          <li>A single measurement is a snapshot. A repeat draw is the standard next step before anything is concluded.</li>
          <li>Results should be reviewed alongside your other health information and lab findings.</li>
        </ul>
      </Card>
    </div>
  );
}
