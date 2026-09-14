import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getProfile } from '@/lib/api';
import { NotificationToggle } from '@/components/profile/NotificationToggle';

export default async function ProfilePage() {
  const live = await getProfile();

  const name = live?.name ?? 'Shayan';
  const email = live?.email ?? 'shayan@example.com';
  const dob = live?.clinicalDetails?.date_of_birth ?? '1 January 1956';
  const sex = live?.clinicalDetails?.sex_assigned_at_birth ?? 'Male';
  const gender = live?.clinicalDetails?.gender ?? '';
  const affectsGrading = live?.affectsGrading ?? true;
  const notificationsEnabled = live?.notificationsEnabled ?? true;
  const address = live?.shippingAddress
    ? [live.shippingAddress.line, live.shippingAddress.city, live.shippingAddress.state, live.shippingAddress.postCode]
        .filter(Boolean)
        .join(', ')
    : '5941 Optical Ct, Room 203H, San Jose CA 95138';

  return (
    <div>
      <PageHeader title="Profile & settings" subtitle="Some of this changes how your results are graded, not just how they look." />

      <Card className="mb-6 border-status-watch/30">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-medium text-ink-900">Clinical details</p>
          {affectsGrading && (
            <span className="rounded-pill bg-status-watchBg px-3 py-1 text-xs font-medium text-status-watch">Affects grading</span>
          )}
        </div>
        <p className="mb-4 text-sm text-ink-900/60">
          Reference intervals for testosterone, estradiol, DHT and progesterone differ by sex and by age. Without
          these, four of your markers cannot be graded and will show as unclassified.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Legal name" value={name} />
          <Field label="Date of birth" value={dob} />
          <Field label="Sex assigned at birth" value={sex} />
        </div>
        <p className="mt-3 text-xs text-ink-900/50">
          We ask for sex assigned at birth because that is what laboratory reference intervals are built on. If your
          gender differs, tell us below and your clinician will see both.
        </p>
        <div className="mt-3">
          <Field label="Gender (optional, shown to your clinician)" value={gender} placeholder="Add if you'd like us to use it" />
        </div>
      </Card>

      <Card className="mb-6">
        <p className="mb-4 font-medium text-ink-900">How results are shown</p>
        <Row label="Measurement units" desc="Your report carries both. Testosterone reads 500 ng/dL conventional, 17.3 nmol/L SI.">
          <span className="rounded-pill border border-cream-line bg-cream px-3 py-1 text-xs font-medium text-ink-900">Conventional</span>
        </Row>
        <Row label="Show optimal bands as well as reference intervals" desc="Reference intervals describe the general population. Optimal bands describe where long-term risk appears lowest.">
          <span className="inline-flex h-6 w-11 items-center justify-end rounded-pill bg-status-optimal p-0.5">
            <span className="h-5 w-5 rounded-full bg-white shadow" />
          </span>
        </Row>
      </Card>

      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-medium text-ink-900">Notifications</p>
          <NotificationToggle initialEnabled={notificationsEnabled} />
        </div>
        <p className="text-sm text-ink-900/60">
          One switch covers results-released alerts, kit &amp; sample updates, retest reminders, and product news —
          turn it off and none of them will reach you.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="mb-3 font-medium text-ink-900">Account</p>
          <Field label="Email" value={email} action="Change" />
          <Field label="Shipping address" value={address} />
          <Field label="Payment methods" value="Visa ending 4242" action="Manage in Shopify" />
        </Card>
        <Card>
          <p className="mb-1 font-medium text-ink-900">Your data</p>
          <p className="mb-3 text-sm text-ink-900/60">
            Your results are protected health information. You can take a copy with you or ask us to delete it at
            any time.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="justify-between">Export everything</Button>
            <Button variant="secondary" href="/consents" className="justify-between">Consent history</Button>
            <Button variant="danger" className="justify-between">Delete my account and data</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value, placeholder, action }: { label: string; value: string; placeholder?: string; action?: string }) {
  return (
    <div>
      <p className="text-xs text-ink-900/50">{label}</p>
      <div className="mt-1 flex items-center justify-between rounded-card border border-cream-line bg-cream px-3 py-2 text-sm text-ink-900">
        <span className={value ? '' : 'text-ink-900/30'}>{value || placeholder}</span>
        {action && <button className="text-xs font-medium text-status-optimal">{action}</button>}
      </div>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-cream-line py-3 first:border-t-0 first:pt-0">
      <div className="max-w-md">
        <p className="text-sm font-medium text-ink-900">{label}</p>
        <p className="text-xs text-ink-900/50">{desc}</p>
      </div>
      {children}
    </div>
  );
}
