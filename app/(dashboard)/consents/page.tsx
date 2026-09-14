import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getConsents, getConsentTemplates } from '@/lib/api';
import { SignConsentButton } from '@/components/consents/SignConsentButton';

const FALLBACK_ON_FILE = [
  { id: '1', title: 'General testing consent', meta: 'Order #BAL-7845123 · version 2.1 · signed 28 Jan 2026, 19:42', status: 'Signed' },
  { id: '2', title: 'Biomarker blood draw consent', meta: 'Order #BAL-7845123 · version 2.1 · signed 28 Jan 2026, 19:43', status: 'Signed' },
];

const STATUS_STYLE: Record<string, string> = {
  Signed: 'text-status-optimal',
  Submitted: 'text-status-optimal',
  Superseded: 'text-ink-900/40',
};

export default async function ConsentsPage() {
  const [live, templates] = await Promise.all([getConsents(), getConsentTemplates()]);

  const onFile = live?.onFile?.length
    ? live.onFile.map((c) => ({
        id: c.id,
        title: c.subject,
        meta: `Signed ${new Date(c.signedAt ?? '').toLocaleString()}`,
        status: c.status === 'signed' ? 'Signed' : 'Superseded',
      }))
    : FALLBACK_ON_FILE;

  const needsIntake = live?.needsYou?.intakeInProgress;
  const needsDraw = live?.needsYou?.drawNotScheduled;
  const outstandingCount = live ? [needsIntake, needsDraw].filter(Boolean).length : 2;

  const unsigned = templates?.filter((t) => !t.alreadySigned) ?? [];

  return (
    <div>
      <PageHeader title="Consents & intake" subtitle="Everything you've signed or filled in, against the order it belongs to." />

      {!live && (
        <p className="mb-4 rounded-card bg-status-watchBg px-3 py-2 text-xs text-status-watch">
          Showing sample data — could not reach the BioAro API.
        </p>
      )}

      <Card className="mb-6 border-status-watch/30 bg-status-watchBg">
        <p className="mb-3 text-sm font-medium text-ink-900">Needs you &middot; {outstandingCount + unsigned.length} outstanding</p>
        <div className="flex flex-col gap-3">
          {unsigned.map((t) => (
            <div key={t.templateId} className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-white/60 p-3">
              <div>
                <p className="text-sm font-medium text-ink-900">{t.subject}</p>
                <p className="text-xs text-ink-900/60 line-clamp-2">{t.message}</p>
              </div>
              <SignConsentButton templateId={t.templateId} />
            </div>
          ))}
          {!templates && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-white/60 p-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">Biomarker health &amp; lifestyle questionnaire</p>
                  <p className="text-xs text-ink-900/60">Order #BAL-7845123 &middot; started 12 Feb &middot; step 5 of 8</p>
                </div>
                <Button>Continue</Button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-white/60 p-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">Blood draw not yet scheduled</p>
                  <p className="text-xs text-ink-900/60">Order #BAL-7902884 &middot; The BioGut Test</p>
                </div>
                <Button variant="secondary">Book a draw</Button>
              </div>
            </>
          )}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-cream-line px-5 py-3">
          <p className="font-medium text-ink-900">On file</p>
          <button className="text-sm text-ink-900/60 hover:text-ink-900">Download all as PDF</button>
        </div>
        <div className="divide-y divide-cream-line">
          {onFile.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className={`text-sm font-medium ${STATUS_STYLE[item.status]}`}>&bull; {item.status}</p>
                <p className="mt-1 font-medium text-ink-900">{item.title}</p>
                <p className="text-xs text-ink-900/50">{item.meta}</p>
              </div>
              <button className="text-sm text-ink-900/70 hover:text-ink-900">View</button>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="bg-cream">
          <p className="text-sm font-medium text-ink-900">Versioned, not overwritten</p>
          <p className="mt-1 text-sm text-ink-900/60">
            When a consent document changes we ask again rather than editing what you signed. The old version stays
            readable so you can always see what you actually agreed to.
          </p>
        </Card>
        <Card className="bg-cream">
          <p className="text-sm font-medium text-ink-900">Your draft is on this device only</p>
          <p className="mt-1 text-sm text-ink-900/60">
            The questionnaire in progress hasn&apos;t reached us yet. Once intake moves to your account it will follow
            you between phone and laptop.
          </p>
        </Card>
      </div>
    </div>
  );
}
