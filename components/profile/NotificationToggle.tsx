'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from '@/lib/mutate';

export function NotificationToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    const next = !enabled;
    setEnabled(next); // optimistic
    setLoading(true);
    const result = await mutate('profile/notifications', 'PATCH', { enabled: next });
    setLoading(false);
    if (!result.ok) {
      setEnabled(!next); // revert on failure
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={enabled}
      className={`inline-flex h-6 w-11 items-center rounded-pill p-0.5 transition-colors disabled:opacity-60 ${
        enabled ? 'bg-status-optimal justify-end' : 'bg-cream-line justify-start'
      }`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow" />
    </button>
  );
}
