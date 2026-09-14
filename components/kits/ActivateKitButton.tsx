'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from '@/lib/mutate';
import { Button } from '@/components/ui/Button';

export function ActivateKitButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    const result = await mutate(`kits/${itemId}/activate`, 'PATCH');
    setLoading(false);
    if (!result.ok) {
      setError('Could not activate — try again.');
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={onClick}>{loading ? 'Activating…' : 'Activate kit'}</Button>
      {error && <p className="text-xs text-status-elevated">{error}</p>}
    </div>
  );
}
