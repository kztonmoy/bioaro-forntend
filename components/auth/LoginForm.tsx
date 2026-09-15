'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/';

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Something went wrong.');
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError('Could not reach the sign-in service.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex items-center justify-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
          B
        </span>
        <span className="font-display text-lg font-semibold text-ink-900">BioAro Labs</span>
      </div>

      <div className="rounded-card border border-cream-line bg-cream-card p-6 shadow-card">
        <h1 className="font-display text-xl font-semibold text-ink-900">Sign in</h1>
        <p className="mt-1 text-sm text-ink-900/60">Access your results, orders, and consents.</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-900/60">Email or phone</label>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="shayan@example.com"
              className="w-full rounded-card border border-cream-line bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-900/60">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-card border border-cream-line bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
            />
          </div>

          {error && (
            <p className="rounded-card bg-status-elevatedBg px-3 py-2 text-sm text-status-elevated">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-pill bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-ink-900/60">
        New here?{' '}
        <a href="/register" className="font-medium text-status-optimal underline">
          Create an account
        </a>
      </p>

      <p className="mt-4 text-center text-xs text-ink-900/40">
        This signs in against the bioaro-dashboard-api backend. If{' '}
        <code className="mx-1 rounded bg-cream-line px-1 py-0.5">NEXT_PUBLIC_API_URL</code>
        isn&apos;t set, sign-in is unavailable and the app runs on bundled sample data only.
      </p>
    </div>
  );
}