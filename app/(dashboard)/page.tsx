import Link from 'next/link';
import { getOverview } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatValue, DOMAIN_ACCENTS, DOMAIN_STATUS_LABEL } from '@/lib/status';
import { Button } from '@/components/ui/Button';

// Screens 01 (desktop) & 02 (mobile) share one information architecture;
// this single responsive page renders both.
export default async function OverviewPage() {
  const overview = await getOverview();

  return (
    <div>
      <TopBar />

      <div className="mb-6 flex flex-col gap-4 rounded-card border border-status-watch/30 bg-status-watchBg p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink-900">Your biomarker intake questionnaire is still open</p>
          <p className="text-xs text-ink-900/60">Order #{overview.testId} &middot; takes about 10 minutes &middot; saves as you go</p>
        </div>
        <Button href="/consents">Continue</Button>
      </div>

      <Card className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="font-display text-base font-semibold text-ink-900">Your inflammation &amp; longevity summary</p>
          <p className="mt-2 text-sm text-ink-900/70">
            {overview.statusCounts.optimal} of {overview.total} of your markers sit in their optimal band. Inflammatory
            signalling and several steroid hormones are outside their reference intervals and are the clearest place
            to focus with your clinician.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-900/60">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-optimal" /> Optimal &middot; {overview.statusCounts.optimal}</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-watch" /> Needs attention &middot; {overview.statusCounts.needsAttention}</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-elevated" /> Out of range &middot; {overview.statusCounts.outOfRange}</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-neutral" /> No reference range &middot; {overview.statusCounts.notTested}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-status-watch">
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-ink-900">{overview.scorePercent}</p>
              <p className="text-[10px] uppercase tracking-wide text-ink-900/50">in range</p>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-medium text-status-watch">Needs review</p>
            <p className="text-ink-900/60">
              {overview.inRange} of {overview.total} markers in range.
              <br />
              Reviewed by the BioAro clinical team.
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {overview.domains.map((domain) => {
          const accent = DOMAIN_ACCENTS[domain.slug] ?? DOMAIN_ACCENTS.microbiome;
          const notTested = domain.status === 'not_tested';
          return (
            <Link
              key={domain.slug}
              href={notTested ? '/kits' : `/results/domains/${domain.slug}`}
              className="rounded-card border border-cream-line bg-cream-card p-4 shadow-card transition-shadow hover:shadow-md"
            >
              <span className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${accent.bg} ${accent.text}`}>
                &bull;
              </span>
              <p className="text-sm font-medium leading-tight text-ink-900">{domain.name}</p>
              {notTested ? (
                <>
                  <p className="mt-2 text-sm font-medium text-status-neutral">Not tested</p>
                  <p className="text-xs text-ink-900/50">Explore this panel</p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-sm font-medium" style={{ color: 'inherit' }}>
                    {DOMAIN_STATUS_LABEL[domain.status]}
                  </p>
                  <p className="text-xs text-ink-900/50">{domain.markersInRange} of {domain.markersTotal} in range</p>
                  <div className="mt-2 h-1 w-full rounded-pill bg-cream-line">
                    <div
                      className="h-1 rounded-pill bg-status-elevated"
                      style={{ width: `${100 - (domain.markersInRange / domain.markersTotal) * 100}%` }}
                    />
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-base font-semibold text-ink-900">Furthest from optimal</p>
            <Link href="/results" className="text-sm text-ink-900/60 hover:text-ink-900">View all {overview.total}</Link>
          </div>
          <div className="flex flex-col gap-4">
            {overview.furthestFromOptimal.map((marker) => (
              <Link key={marker.id} href={`/results/markers/${marker.id}`} className="block">
                <div className="flex items-baseline justify-between text-sm">
                  <p className="font-medium text-ink-900">
                    {marker.name} <span className="text-ink-900/40">&middot; {marker.domainName.split(' ')[0]}</span>
                  </p>
                  <p className="font-medium text-status-elevated">{formatValue(marker.value, marker.unit)}</p>
                </div>
                <ProgressBar position={marker.positionInRange} status={marker.status} className="mt-2" />
                <p className="mt-1 text-xs text-ink-900/50">{marker.referenceText}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-display text-base font-semibold text-ink-900">What to do next</p>
          <p className="mt-2 text-sm text-ink-900/70">
            Take this report to your physician. Several hormone markers fall well outside their male reference
            intervals and warrant a repeat draw before any conclusion.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Repeat hormone panel', 'Vitamin D support', 'Anti-inflammatory diet'].map((tag) => (
              <span key={tag} className="rounded-pill bg-cream px-3 py-1 text-xs text-ink-900/70">{tag}</span>
            ))}
          </div>
          <Button href="/recommendations" className="mt-5 w-full">View full recommendations &rarr;</Button>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-card border border-cream-line bg-cream-card p-4 text-xs text-ink-900/50 sm:grid-cols-3">
        <p><span className="font-medium text-ink-900">Private and secure</span><br />Enterprise-grade encryption at rest and in transit.</p>
        <p><span className="font-medium text-ink-900">CLIA-registered &amp; HIPAA compliant</span><br />Processed in CLIA-certified laboratories.</p>
        <p><span className="font-medium text-ink-900">Reviewed by clinical team</span><br />Every panel is checked before release.</p>
      </div>
    </div>
  );
}
