import { Button } from '@/components/ui/Button';

// Screen 16: results-ready email. Rendered here as a standalone preview —
// this is what NotificationsService.sendResultsReadyEmail composes, minus
// live delivery. It intentionally carries no marker values.
export default function EmailPreviewPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-6">
      <div className="w-full max-w-md rounded-card border border-cream-line bg-cream-card shadow-card overflow-hidden">
        <div className="bg-ink-900 px-5 py-4 text-white">
          <p className="text-sm font-medium">BioAro Labs</p>
        </div>
        <div className="p-6">
          <h1 className="font-display text-lg font-semibold text-ink-900">
            Your Inflammation &amp; Longevity results are ready
          </h1>
          <p className="mt-4 text-sm text-ink-900/70">Hello Shayan,</p>
          <p className="mt-2 text-sm text-ink-900/70">
            Your panel has been processed and reviewed by our clinical team. All 28 markers are now in your account.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-card bg-cream p-3 text-sm text-ink-900/70">
            <span>🔒</span>
            <p>
              We don&apos;t put results in email. Sign in to see them &mdash; that way your health information stays
              behind your account rather than sitting in an inbox.
            </p>
          </div>
          <p className="mt-4 text-sm text-ink-900/70">
            Some markers in this panel fall outside their reference intervals. That is common and is a prompt to
            follow up, not a diagnosis. Your consultation is included &mdash; book it whenever suits you.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button href="/" className="w-full">View my results &rarr;</Button>
            <Button href="/orders" variant="secondary" className="w-full">Book my results consultation</Button>
          </div>
          <div className="mt-6 border-t border-cream-line pt-4 text-xs text-ink-900/40">
            <p>Panel: Inflammation &amp; Longevity &middot; 28 markers</p>
            <p>Collected 9 February 2026 &middot; released 31 March 2026</p>
            <p>Test ID BAL-7845123</p>
          </div>
        </div>
        <div className="border-t border-cream-line bg-cream px-6 py-3 text-[11px] text-ink-900/40">
          This message is intended for Shayan only and contains no health information. If it reached you in error, please delete it.
        </div>
      </div>
    </div>
  );
}
