import Link from 'next/link';
import { getTrendSummary, getMarkerTrend } from '@/lib/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { MARKERS } from '@/lib/mock-data';

export default async function TrendsPage() {
  const summary = await getTrendSummary();
  const vitaminD = await getMarkerTrend('vitamin-d');
  const marker = MARKERS.find((m) => m.id === 'vitamin-d')!;

  return (
    <div>
      <PageHeader
        title="Change over time"
        subtitle="What improved, what worsened, and one marker's series climbing into range across panels."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-900/60">Markers improved</p>
          <p className="mt-1 font-display text-3xl font-semibold text-status-optimal">{summary.improved}</p>
          <p className="text-xs text-ink-900/50">since the last panel</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-900/60">Markers worsened</p>
          <p className="mt-1 font-display text-3xl font-semibold text-status-elevated">{summary.worsened}</p>
          <p className="text-xs text-ink-900/50">since the last panel</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-900/60">In range now</p>
          <p className="mt-1 font-display text-3xl font-semibold text-ink-900">
            {summary.inRangeNow} <span className="text-sm font-normal text-status-optimal">up from {summary.inRangePrevious}</span>
          </p>
        </Card>
      </div>

      {vitaminD.length > 0 ? (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-base font-semibold text-ink-900">{marker.name}</p>
            {vitaminD.length > 1 && (
              <p className="text-xs text-status-optimal">
                &uarr; +{(vitaminD[vitaminD.length - 1].value - vitaminD[0].value).toFixed(1)} {marker.unit} over time
              </p>
            )}
          </div>
          <div className="mt-6 flex items-end justify-between gap-4">
            {vitaminD.map((point, i) => (
              <div key={`${point.date}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full max-w-[64px] rounded-t bg-status-optimal/70"
                  style={{ height: `${Math.max(point.value * 3, 16)}px` }}
                />
                <p className="font-medium text-ink-900">{point.value}</p>
                <p className="text-xs text-ink-900/50">{point.date}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-900/60">
            Rising steadily and now at the lower bound of the reference interval for the first time.
          </p>
        </Card>
      ) : (
        <Card className="mb-6 text-sm text-ink-900/60">
          Not enough history yet for {marker.name} &mdash; a second panel will draw a trend line here.
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="font-medium text-ink-900">Improving</p>
          <div className="mt-3 flex flex-col gap-2">
            {summary.improving.map((row) => (
              <div key={row.name} className="flex items-center justify-between text-sm">
                <p className="text-ink-900/80">{row.name}</p>
                <p className="text-ink-900/50">
                  {row.from} &rarr; {row.to} <span className="ml-1 rounded-pill bg-status-optimalBg px-2 py-0.5 text-status-optimal">{row.change}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="font-medium text-ink-900">Moving the wrong way</p>
          <div className="mt-3 flex flex-col gap-2">
            {summary.worsening.map((row) => (
              <div key={row.name} className="flex items-center justify-between text-sm">
                <p className="text-ink-900/80">{row.name}</p>
                <p className="text-ink-900/50">
                  {row.from} &rarr; {row.to} <span className="ml-1 rounded-pill bg-status-elevatedBg px-2 py-0.5 text-status-elevated">{row.change}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-900/50">
            Direction matters more than any single value, but three points is still a short series.
          </p>
        </Card>
      </div>
    </div>
  );
}
