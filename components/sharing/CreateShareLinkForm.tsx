'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from '@/lib/mutate';
import { Button } from '@/components/ui/Button';

export function CreateShareLinkForm() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState('Dr Amara Osei · Kaiser Permanente');
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [requireEmail, setRequireEmail] = useState(true);
  const [scope, setScope] = useState({ panel: true, pdf: true, intake: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCreate() {
    setLoading(true);
    setError(null);
    const selectedScope = [
      scope.panel && 'panel:latest',
      scope.pdf && 'signed_pdf',
      scope.intake && 'intake_answers',
    ].filter(Boolean) as string[];

    const result = await mutate('sharing/links', 'POST', {
      recipientName,
      scope: selectedScope,
      expiresInDays,
      requireEmailToOpen: requireEmail,
    });
    setLoading(false);
    if (!result.ok) {
      setError('Could not create the link — try again.');
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-900/50">What they can see</p>
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center justify-between rounded-card border border-cream-line px-3 py-2">
            <span className="flex items-center gap-2 text-ink-900">
              <input
                type="checkbox"
                checked={scope.panel}
                onChange={(e) => setScope((s) => ({ ...s, panel: e.target.checked }))}
                className="h-4 w-4 accent-ink-900"
              />
              Inflammation &amp; Longevity panel
            </span>
          </label>
          <label className="flex items-center justify-between rounded-card border border-cream-line px-3 py-2">
            <span className="flex items-center gap-2 text-ink-900">
              <input
                type="checkbox"
                checked={scope.pdf}
                onChange={(e) => setScope((s) => ({ ...s, pdf: e.target.checked }))}
                className="h-4 w-4 accent-ink-900"
              />
              The signed laboratory PDF
            </span>
          </label>
          <label className="flex items-center justify-between rounded-card border border-cream-line px-3 py-2">
            <span className="flex items-center gap-2 text-ink-900">
              <input
                type="checkbox"
                checked={scope.intake}
                onChange={(e) => setScope((s) => ({ ...s, intake: e.target.checked }))}
                className="h-4 w-4 accent-ink-900"
              />
              Your intake answers
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-900/50">Who it&apos;s for</p>
          <input
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full rounded-card border border-cream-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-900/50">Expires after</p>
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setExpiresInDays(d)}
                className={`rounded-pill px-3 py-1.5 text-sm ${d === expiresInDays ? 'bg-ink-900 text-white' : 'border border-cream-line text-ink-900/70'}`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center justify-between rounded-card border border-cream-line px-3 py-2 text-sm">
          <span>
            Require their email to open
            <span className="block text-xs text-ink-900/40">A one-time code, so a forwarded link is useless</span>
          </span>
          <input
            type="checkbox"
            checked={requireEmail}
            onChange={(e) => setRequireEmail(e.target.checked)}
            className="h-4 w-4 accent-ink-900"
          />
        </label>
      </div>

      <div className="lg:col-span-2 flex items-center gap-3">
        <Button onClick={onCreate}>{loading ? 'Creating…' : 'Create link'}</Button>
        <p className="text-xs text-ink-900/50">You can revoke it at any moment, even after they&apos;ve opened it.</p>
        {error && <p className="text-xs text-status-elevated">{error}</p>}
      </div>
    </div>
  );
}
