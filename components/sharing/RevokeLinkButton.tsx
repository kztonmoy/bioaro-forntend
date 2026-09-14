'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from '@/lib/mutate';
import { Button } from '@/components/ui/Button';

export function RevokeLinkButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    const result = await mutate(`sharing/links/${id}`, 'DELETE');
    setLoading(false);
    if (result.ok) router.refresh();
  }

  return (
    <Button variant="danger" onClick={onClick}>
      {loading ? 'Revoking…' : 'Revoke'}
    </Button>
  );
}
