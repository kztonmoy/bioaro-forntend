'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function onClick() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button onClick={onClick} className={className}>
      Sign out
    </button>
  );
}
