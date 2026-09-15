'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from '@/lib/mutate';
import { Button } from '@/components/ui/Button';

// ⚠️ DEV/TEST ONLY — calls the backend's test-generate-report shortcut,
// which fabricates a sample longevity_reports row for this kit instead
// of waiting on a real lab data feed. Only works when the backend has
// ENABLE_TEST_PAYMENT_ENDPOINT=true.
export function GenerateReportButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    const result = await mutate<Record<string, any>>(`kits/${itemId}/test-generate-report`, 'POST');
    setLoading(false);
    if (!result.ok) {
      const msg = 'message' in result.data ? result.data.message : 'Could not generate a report.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button variant="secondary" onClick={onClick} className="border-status-optimal/50 text-status-optimal">
        {loading ? 'Generating…' : '🧪 Generate Report (test)'}
      </Button>
      {error && <p className="text-xs text-status-elevated">{error}</p>}
    </div>
  );
}