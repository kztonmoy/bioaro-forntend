import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const STAGES = [
  { label: 'Ordered', date: '28 Jan', done: true },
  { label: 'Kit shipped', date: '30 Jan', done: true },
  { label: 'Activate your kit', date: 'Waiting on you', current: true },
  { label: 'Blood draw', date: 'Not scheduled' },
  { label: 'Lab processing', date: '7\u201310 days' },
  { label: 'Results ready', date: '\u2014' },
];

const DOMAIN_COUNTS = [
  ['Inflammation & immunity', 9],
  ['Hormones & steroids', 9],
  ['Vitamins & nutritional status', 5],
  ['Organ & renal stress', 2],
  ['Brain & cognition', 2],
  ['Bioactives', 1],
] as const;

export default function BeforeResultsPage() {
  return (
    <div>
      <PageHeader title="Welcome, Shayan" subtitle="Your kit is on its way. Here's where things stand." />

      <Card className="mb-6">
        <p className="mb-4 font-display text-base font-semibold text-ink-900">Inflammation &amp; Longevity panel</p>
        <div className="flex items-center gap-1 overflow-x-auto">
          {STAGES.map((stage, i) => (
            <div key={stage.label} className="flex flex-1 items-center gap-1">
              <div className="flex flex-col items-center gap-1 text-center">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium ${
                    stage.done ? 'bg-status-optimal text-white' : stage.current ? 'border-2 border-status-watch text-status-watch' : 'bg-cream-line text-ink-900/40'
                  }`}
                >
                  {stage.done ? '\u2713' : i + 1}
                </span>
                <p className="whitespace-nowrap text-[11px] font-medium text-ink-900">{stage.label}</p>
                <p className="whitespace-nowrap text-[10px] text-ink-900/40">{stage.date}</p>
              </div>
              {i < STAGES.length - 1 && <span className="h-px flex-1 bg-cream-line" />}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card bg-status-watchBg p-4">
          <div>
            <p className="text-sm font-medium text-ink-900">Activate your kit to start the clock</p>
            <p className="text-xs text-ink-900/60">You&apos;ll find the 8-character ID on the inside of the box lid.</p>
          </div>
          <Button>Activate kit</Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="font-medium text-ink-900">What you&apos;ll see here</p>
          <p className="mt-2 text-sm text-ink-900/60">
            Twenty-eight markers across six domains, each placed against its reference interval and explained in
            plain language.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {DOMAIN_COUNTS.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <p className="text-ink-900/80">{name}</p>
                <p className="text-ink-900/40">{count}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-medium text-ink-900">While you wait</p>
          <div className="mt-3 flex flex-col gap-3">
            {[
              { title: 'Complete your intake questionnaire', body: 'Medications, supplements and history. Takes about 10 minutes and saves as you go.', href: '/consents' },
              { title: 'Confirm your date of birth and sex', body: 'Several hormone intervals differ by both. Without them those markers cannot be graded.', href: '/profile' },
              { title: 'Book your blood draw', body: 'Fasting is not required for this panel. Morning draws are preferred for cortisol.', href: '/orders' },
            ].map((item) => (
              <a key={item.title} href={item.href} className="rounded-card bg-cream p-3">
                <p className="text-sm font-medium text-ink-900">{item.title}</p>
                <p className="mt-1 text-xs text-ink-900/60">{item.body}</p>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
