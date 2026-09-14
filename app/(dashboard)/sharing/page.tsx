import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { getShareLinks } from '@/lib/api';
import { CreateShareLinkForm } from '@/components/sharing/CreateShareLinkForm';
import { RevokeLinkButton } from '@/components/sharing/RevokeLinkButton';

const FALLBACK_LINKS = [
  { id: 'sample-1', name: 'Dr Amara Osei · Kaiser Permanente', meta: 'Opened twice · last 2 Sep, 09:14', expires: 'Expires 2 Oct 2026', active: true },
  { id: 'sample-2', name: 'Longevity Clinic, Palo Alto', meta: 'Not yet opened · sent 1 Sep', expires: 'Expires 8 Sep 2026', active: true },
];

export default async function SharingPage() {
  const live = await getShareLinks();
  const links = live?.length
    ? live.map((l) => ({
        id: l.id,
        name: l.recipientName,
        meta: `Opened ${l.openCount} times${l.lastOpenedAt ? ` · last ${new Date(l.lastOpenedAt).toLocaleString()}` : ''}`,
        expires: l.expiresAt ? `Expires ${new Date(l.expiresAt).toLocaleDateString()}` : '',
        active: l.status === 'active',
      }))
    : FALLBACK_LINKS;

  return (
    <div>
      <PageHeader title="Share with a clinician" subtitle="A read-only link that expires. No account needed at their end." />

      {!live && (
        <p className="mb-4 rounded-card bg-status-watchBg px-3 py-2 text-xs text-status-watch">
          Showing sample data — could not reach the BioAro API.
        </p>
      )}

      <Card className="mb-6">
        <p className="mb-4 font-medium text-ink-900">New link</p>
        <CreateShareLinkForm />
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-cream-line px-5 py-3">
          <p className="font-medium text-ink-900">Active links</p>
          <p className="text-xs text-ink-900/50">{links.filter((l) => l.active).length} active</p>
        </div>
        <div className="divide-y divide-cream-line">
          {links.map((link) => (
            <div key={link.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${link.active ? 'bg-status-optimal' : 'bg-ink-900/20'}`} />
                <p className="font-medium text-ink-900">{link.name}</p>
              </div>
              <div className="text-right text-xs text-ink-900/50">
                <p>{link.meta}</p>
                {link.expires && <p>{link.expires}</p>}
              </div>
              {link.active && !link.id.startsWith('sample-') ? (
                <RevokeLinkButton id={link.id} />
              ) : (
                <span className="text-xs text-ink-900/30">&mdash;</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 bg-cream text-sm text-ink-900/60">
        Every open is logged with a timestamp. Sharing a link does not give anyone the ability to change your record,
        book on your behalf, or see your orders and payment details &mdash; only the panels you ticked.
      </Card>
    </div>
  );
}
