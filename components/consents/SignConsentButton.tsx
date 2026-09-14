'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from '@/lib/mutate';
import { Button } from '@/components/ui/Button';

export function SignConsentButton({ templateId }: { templateId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    const result = await mutate('consents/sign', 'POST', { templateId });
    setLoading(false);
    if (!result.ok) {
      setError('Could not sign — try again.');
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={onClick}>{loading ? 'Signing…' : 'Sign'}</Button>
      {error && <p className="text-xs text-status-elevated">{error}</p>}
    </div>
  );
}
