'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', dateOfBirth: '', sexAssignedAtBirth: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Something went wrong.');
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Could not reach the sign-up service.');
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
        <h1 className="font-display text-xl font-semibold text-ink-900">Create your account</h1>
        <p className="mt-1 text-sm text-ink-900/60">Set up access to your results, orders, and consents.</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <Field label="Full name" value={form.name} onChange={(v) => set('name', v)} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => set('email', v)} required />
          <Field label="Phone (optional)" value={form.phone} onChange={(v) => set('phone', v)} />
          <Field label="Password" type="password" value={form.password} onChange={(v) => set('password', v)} required minLength={6} />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of birth" type="date" value={form.dateOfBirth} onChange={(v) => set('dateOfBirth', v)} />
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-900/60">Sex assigned at birth</label>
              <select
                value={form.sexAssignedAtBirth}
                onChange={(e) => set('sexAssignedAtBirth', e.target.value)}
                className="w-full rounded-card border border-cream-line bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-ink-900/40">
            Used only to grade sex-specific hormone reference intervals — you can change it later in Profile.
          </p>

          {error && (
            <p className="rounded-card bg-status-elevatedBg px-3 py-2 text-sm text-status-elevated">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-pill bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-ink-900/60">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-status-optimal underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

function Field({
  label, value, onChange, type = 'text', required, minLength,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; minLength?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-900/60">{label}</label>
      <input
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-card border border-cream-line bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
      />
    </div>
  );
}