import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { getKits, KitView } from '@/lib/api';
import { ActivateKitButton } from '@/components/kits/ActivateKitButton';
import { GenerateReportButton } from '@/components/kits/GenerateReportButton';
import { Button } from '@/components/ui/Button';

// Fallback sample — used only when the live API returned nothing
// (backend unreachable, no NEXT_PUBLIC_API_URL, or this patient has no
// `items` rows yet).
const FALLBACK: KitView[] = [
  {
    itemId: 'sample-biogut',
    serviceId: null,
    serviceSlug: null,
    name: 'The BioGut Test',
    description: 'Comprehensive gut microbiome analysis',
    price: 690,
    statusCode: 2,
    statusLabel: 'Order Received',
    isException: false,
    trackingNumber: null,
    bloodDraw: null,
    resultsReady: false,
    reportId: null,
    reportRead: false,
    stages: [
      { status: 1, label: 'Order Placed', done: true, current: false },
      { status: 2, label: 'Order Received', done: true, current: true },
      { status: 3, label: 'Checked In', done: false, current: false },
      { status: 4, label: 'Shipping', done: false, current: false },
      { status: 5, label: 'Kit Delivered', done: false, current: false },
      { status: 7, label: 'Sample Collected', done: false, current: false },
      { status: 8, label: 'Sent To Technician', done: false, current: false },
      { status: 9, label: 'Test In Progress', done: false, current: false },
      { status: 10, label: 'Finished Order', done: false, current: false },
    ],
  },
  {
    itemId: 'sample-inflammation',
    serviceId: null,
    serviceSlug: null,
    name: 'Inflammation & Longevity Panel',
    description: '28-marker panel',
    price: 1240,
    statusCode: 10,
    statusLabel: 'Finished Order',
    isException: false,
    trackingNumber: null,
    bloodDraw: { date: '2026-02-09', time: '08:20:00' },
    resultsReady: true,
    reportId: 'sample-report',
    reportRead: true,
    stages: [],
  },
];

export default async function KitsPage() {
  const live = await getKits();
  const kits = live && live.length > 0 ? live : FALLBACK;

  const active = kits.filter((k) => !k.resultsReady && !k.isException);
  const completed = kits.filter((k) => k.resultsReady);
  const exceptions = kits.filter((k) => k.isException);

  return (
    <div>
      <PageHeader title="Tests & kits" subtitle="Where every kit is, from despatch to released result." />

      {!live && (
        <p className="mb-4 rounded-card bg-status-watchBg px-3 py-2 text-xs text-status-watch">
          Showing sample data — could not reach the BioAro API.
        </p>
      )}

      {active.map((kit) => (
        <Card key={kit.itemId} className="mb-6 border-status-watch/30">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-base font-semibold text-ink-900">{kit.name}</p>
              {kit.description && <p className="text-xs text-ink-900/50">{kit.description}</p>}
              {kit.trackingNumber && <p className="text-xs text-ink-900/50">Tracking: {kit.trackingNumber}</p>}
            </div>
            <span className="rounded-pill bg-status-watchBg px-3 py-1 text-xs font-medium text-status-watch">
              {kit.statusLabel}
            </span>
          </div>

          {kit.stages.length > 0 && (
            <div className="mt-5 flex items-center gap-1 overflow-x-auto">
              {kit.stages.map((stage, i) => (
                <div key={stage.status} className="flex flex-1 items-center gap-1">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium ${
                        stage.done && !stage.current
                          ? 'bg-status-optimal text-white'
                          : stage.current
                            ? 'border-2 border-status-watch text-status-watch'
                            : 'bg-cream-line text-ink-900/40'
                      }`}
                    >
                      {stage.done && !stage.current ? '\u2713' : i + 1}
                    </span>
                    <p className="whitespace-nowrap text-[11px] text-ink-900/60">{stage.label}</p>
                  </div>
                  {i < kit.stages.length - 1 && <span className="h-px flex-1 bg-cream-line" />}
                </div>
              ))}
            </div>
          )}

          {kit.statusCode <= 2 && !kit.itemId.startsWith('sample-') && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-card bg-status-watchBg p-4">
              <div>
                <p className="text-sm font-medium text-ink-900">Activate this kit to start the clock</p>
                <p className="text-xs text-ink-900/60">You&apos;ll find the ID inside the box lid.</p>
              </div>
              <ActivateKitButton itemId={kit.itemId} />
            </div>
          )}

          {!kit.itemId.startsWith('sample-') && (
            <div className="mt-3 flex justify-end">
              <GenerateReportButton itemId={kit.itemId} />
            </div>
          )}
        </Card>
      ))}

      {exceptions.map((kit) => (
        <Card key={kit.itemId} className="mb-6 border-status-elevated/30 bg-status-elevatedBg">
          <p className="font-medium text-ink-900">{kit.name}</p>
          <p className="mt-1 text-sm text-status-elevated">{kit.statusLabel}</p>
        </Card>
      ))}

      {completed.length > 0 && (
        <Card className="mb-6 p-0 overflow-hidden">
          <div className="border-b border-cream-line px-5 py-3">
            <p className="font-medium text-ink-900">Completed</p>
          </div>
          <div className="divide-y divide-cream-line">
            {completed.map((kit) => (
              <div key={kit.itemId} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium text-ink-900">{kit.name}</p>
                  {kit.bloodDraw && (
                    <p className="text-xs text-ink-900/50">Drawn {new Date(kit.bloodDraw.date).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-pill bg-status-optimalBg px-3 py-1 text-xs font-medium text-status-optimal">
                    Results ready
                  </span>
                  <Button href="/results" variant="secondary">View</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-medium text-ink-900">Due for a repeat</p>
          <p className="mt-1 max-w-xl text-sm text-ink-900/60">
            Your inflammation panel was drawn seven months ago. Three markers were moving in the wrong direction, and
            this panel is most useful at three-to-six month intervals &mdash; a repeat would tell you whether that
            trend continued.
          </p>
        </div>
        <Button href="/orders">Reorder panel &rarr;</Button>
      </Card>
    </div>
  );
}