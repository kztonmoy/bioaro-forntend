import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { getRecommendations } from '@/lib/api';

const FALLBACK_CLINICIAN = [
  { title: 'Repeat the hormone panel before acting on it', body: 'Five of nine steroid markers fall outside their male reference intervals, and SHBG is low enough to affect how the others should be read. A single draw is not enough to act on this pattern.', markers: ['SHBG', 'Estradiol', 'DHT', 'Androstenedione', 'Free testosterone'] },
  { title: 'Discuss kidney function alongside the brain marker', body: 'Cystatin C is above its interval, and reduced clearance affects several plasma proteins including p-Tau217. These two should be read together rather than separately.', markers: ['Cystatin C', 'β2-Microglobulin', 'p-Tau217'] },
];

const FALLBACK_MEANWHILE = [
  { title: 'Vitamin D support', body: "You sit exactly on the lower bound at 20 ng/mL, up from 12 a year ago.", markers: ['Vitamin D, 25-OH'] },
  { title: 'Fat-soluble vitamin review', body: 'Retinol and alpha-tocopherol are both well below interval.', markers: ['Retinol', 'Alpha-tocopherol'] },
  { title: 'Keep the inflammation trend going', body: 'hs-CRP has more than halved and GDF-15 fell by two thirds since August.', markers: ['hs-CRP', 'GDF-15', 'IL-6'] },
];

const FALLBACK_GAPS = ['microbiome-gut', 'vascular-health', 'amino-acids-metabolism'];

export default async function RecommendationsPage() {
  const live = await getRecommendations();

  const clinician = live?.takeToClinician?.length ? live.takeToClinician : FALLBACK_CLINICIAN;
  const meanwhile = live?.worthDoingMeanwhile?.length ? live.worthDoingMeanwhile : FALLBACK_MEANWHILE;
  const gaps = live?.gapsInWhatYouveMeasured?.length ? live.gapsInWhatYouveMeasured : FALLBACK_GAPS;
  const disclaimer =
    live?.disclaimer ??
    'These are informational and generated from your results — they are not a prescription, and nothing here should replace advice from someone who knows your history.';

  return (
    <div>
      <PageHeader title="Recommendations" subtitle="Every suggestion names the markers it came from, so you can check the reasoning." />

      {!live && (
        <p className="mb-4 rounded-card bg-status-watchBg px-3 py-2 text-xs text-status-watch">
          Showing sample data — could not reach the BioAro API.
        </p>
      )}

      {clinician.length > 0 && (
        <Card className="mb-6 border-status-watch/30">
          <p className="mb-4 font-medium text-status-watch">Take to a clinician</p>
          <div className="flex flex-col gap-4">
            {clinician.map((item, i) => (
              <div key={item.title} className="rounded-card bg-status-watchBg p-4">
                <p className="text-xs font-medium text-status-watch">0{i + 1}</p>
                <p className="mt-1 font-medium text-ink-900">{item.title}</p>
                <p className="mt-1 text-sm text-ink-900/70">{item.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.markers.map((m) => (
                    <span key={m} className="rounded-pill bg-white px-2.5 py-1 text-xs text-ink-900/70">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {meanwhile.length > 0 && (
        <Card className="mb-6">
          <p className="mb-4 font-medium text-ink-900">Worth doing meanwhile</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {meanwhile.map((item) => (
              <div key={item.title} className="rounded-card bg-cream p-4">
                <p className="font-medium text-ink-900">{item.title}</p>
                <p className="mt-1 text-sm text-ink-900/70">{item.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.markers.map((m) => (
                    <span key={m} className="rounded-pill bg-white px-2.5 py-1 text-xs text-ink-900/70">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-medium text-ink-900">Gaps in what you&apos;ve measured</p>
          <p className="text-xs text-ink-900/50">{gaps.length} domains untested</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {gaps.map((slug) => (
            <div key={slug} className="rounded-card border border-cream-line p-4">
              <p className="font-medium capitalize text-ink-900">{slug.replace(/-/g, ' ')}</p>
              <a href="/orders" className="mt-3 inline-block text-sm font-medium text-status-optimal">Explore panels</a>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-card bg-cream p-3 text-xs text-ink-900/50">{disclaimer}</p>
      </Card>
    </div>
  );
}
