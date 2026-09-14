'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from '@/lib/mutate';
import { Button } from '@/components/ui/Button';

type Line = { name: string; price: string; description: string };

const EMPTY_LINE: Line = { name: '', price: '', description: '' };

export function CreateOrderForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ ...EMPTY_LINE }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ invoiceUrl: string; invoiceNumber: string } | null>(null);

  function updateLine(i: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { ...EMPTY_LINE }]);
  }

  function removeLine(i: number) {
    setLines((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit() {
    setError(null);
    const items = lines
      .filter((l) => l.name.trim() && l.price.trim())
      .map((l) => ({
        name: l.name.trim(),
        price: parseFloat(l.price),
        description: l.description.trim() || undefined,
      }));

    if (items.length === 0) {
      setError('Add at least one item with a name and price.');
      return;
    }
    if (items.some((i) => Number.isNaN(i.price) || i.price <= 0)) {
      setError('Every price must be a number greater than zero.');
      return;
    }

    setLoading(true);
    const result = await mutate<{ invoiceUrl: string; invoiceNumber: string }>('orders/checkout', 'POST', { items });
    setLoading(false);

    if (!result.ok) {
      const msg = 'message' in result.data ? result.data.message : 'Could not create the order.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      return;
    }

    setSuccess(result.data as { invoiceUrl: string; invoiceNumber: string });
    setLines([{ ...EMPTY_LINE }]);
    router.refresh();
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="mb-6">
        + New order
      </Button>
    );
  }

  return (
    <div className="mb-6 rounded-card border border-cream-line bg-cream-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-base font-semibold text-ink-900">New order</p>
        <button onClick={() => setOpen(false)} className="text-sm text-ink-900/50 hover:text-ink-900">
          Cancel
        </button>
      </div>

      {success ? (
        <div className="rounded-card bg-status-optimalBg p-4 text-sm text-status-optimal">
          <p className="font-medium">Order created — invoice {success.invoiceNumber}</p>
          <p className="mt-1">
            Payment is pending. Invoice link:{' '}
            <a href={success.invoiceUrl} className="underline" target="_blank" rel="noreferrer">
              {success.invoiceUrl}
            </a>
          </p>
          <button onClick={() => { setSuccess(null); setOpen(false); }} className="mt-3 text-xs font-medium underline">
            Close
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {lines.map((line, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr_2fr_auto] sm:items-center">
                <input
                  placeholder="Service name (e.g. Custom Wellness Panel)"
                  value={line.name}
                  onChange={(e) => updateLine(i, { name: e.target.value })}
                  className="rounded-card border border-cream-line px-3 py-2 text-sm"
                />
                <input
                  placeholder="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.price}
                  onChange={(e) => updateLine(i, { price: e.target.value })}
                  className="rounded-card border border-cream-line px-3 py-2 text-sm"
                />
                <input
                  placeholder="Description (optional)"
                  value={line.description}
                  onChange={(e) => updateLine(i, { description: e.target.value })}
                  className="rounded-card border border-cream-line px-3 py-2 text-sm"
                />
                {lines.length > 1 && (
                  <button onClick={() => removeLine(i)} className="text-xs text-ink-900/40 hover:text-status-elevated">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={addLine} className="mt-3 text-sm font-medium text-status-optimal">
            + Add another item
          </button>

          {error && <p className="mt-3 text-sm text-status-elevated">{error}</p>}

          <div className="mt-5 flex items-center gap-3">
            <Button onClick={onSubmit}>{loading ? 'Creating…' : 'Create order'}</Button>
            <p className="text-xs text-ink-900/50">
              Creates a pending payment + kit. Nothing ships until payment is confirmed.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
