'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from '@/lib/mutate';
import { Button } from '@/components/ui/Button';

// ⚠️ DEV/TEST ONLY — calls the backend's test-mark-paid shortcut, which
// bypasses the real Shopify payment flow entirely. Only works when the
// backend has ENABLE_TEST_PAYMENT_ENDPOINT=true — otherwise this button
// will show a clear error instead of silently failing.
export function MarkPaidButton({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    const result = await mutate<Record<string, any>>(`orders/${paymentId}/test-mark-paid`, 'POST');
    setLoading(false);
    if (!result.ok) {
      const msg = 'message' in result.data ? result.data.message : 'Could not mark as paid.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button variant="secondary" onClick={onClick} className="border-status-watch/50 text-status-watch">
        {loading ? 'Marking paid…' : '🧪 Mark as Paid (test)'}
      </Button>
      {error && <p className="text-xs text-status-elevated">{error}</p>}
    </div>
  );
}