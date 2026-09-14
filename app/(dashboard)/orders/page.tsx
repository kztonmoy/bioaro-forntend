import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getOrders, OrderView } from '@/lib/api';
import { CreateOrderForm } from '@/components/orders/CreateOrderForm';

const STATUS_STYLE: Record<string, string> = {
  PAID: 'bg-status-optimalBg text-status-optimal',
  PAYMENT_PENDING: 'bg-status-watchBg text-status-watch',
  REFUNDED: 'bg-status-elevatedBg text-status-elevated',
};

// Fallback sample — used only when the live API returned nothing.
const FALLBACK_ORDERS: OrderView[] = [
  {
    id: 'sample-1', invoiceNumber: 'BAL-7845123', placedAt: '2026-01-28', total: 1240,
    paymentStatus: 'PAID', shopifyOrderId: null, invoiceUrl: null,
    lineItems: [{ itemId: null, name: 'Inflammation & Longevity Panel', price: 1240, status: 1, slug: null }],
  },
  {
    id: 'sample-2', invoiceNumber: 'BAL-7902884', placedAt: '2026-09-02', total: 690,
    paymentStatus: 'PAYMENT_PENDING', shopifyOrderId: null, invoiceUrl: null,
    lineItems: [{ itemId: null, name: 'The BioGut Test', price: 690, status: 0, slug: null }],
  },
];

export default async function OrdersPage() {
  const live = await getOrders();
  const orders = live?.orders?.length ? live.orders : FALLBACK_ORDERS;
  const consultations = live?.consultations ?? [
    { id: 'sample-c1', date: '2026-09-11', start: '14:30:00', status: 0 },
  ];

  return (
    <div>
      <PageHeader title="Orders" subtitle="Every order, the kit it shipped, and the result it produced." />

      {!live && (
        <p className="mb-4 rounded-card bg-status-watchBg px-3 py-2 text-xs text-status-watch">
          Showing sample data — could not reach the BioAro API.
        </p>
      )}

      <CreateOrderForm />

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-ink-900/50">
                  #{order.invoiceNumber ?? order.id} &middot; Placed{' '}
                  {order.placedAt ? new Date(order.placedAt).toLocaleDateString() : '—'}
                </p>
                {order.lineItems.map((line, i) => (
                  <p key={i} className="mt-1 font-display text-base font-semibold text-ink-900">
                    {line.name}
                  </p>
                ))}
              </div>
              <div className="text-right">
                <span className={`rounded-pill px-3 py-1 text-xs font-medium ${STATUS_STYLE[order.paymentStatus] ?? 'bg-cream text-ink-900/60'}`}>
                  {order.paymentStatus.replace(/_/g, ' ')}
                </span>
                <p className="mt-2 font-medium text-ink-900">${order.total?.toFixed(2) ?? '0.00'}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {order.paymentStatus === 'PAYMENT_PENDING' && order.invoiceUrl && (
                <Button href={order.invoiceUrl}>Pay invoice</Button>
              )}
              {order.paymentStatus === 'PAID' && (
                <Button href="/results" variant="secondary">View results</Button>
              )}
              {order.invoiceUrl && (
                <Button href={order.invoiceUrl} variant="secondary">Invoice</Button>
              )}
            </div>

            {order.invoiceUrl && (
              <p className="mt-3 truncate text-xs text-ink-900/40">
                Invoice:{' '}
                <a href={order.invoiceUrl} target="_blank" rel="noreferrer" className="text-status-optimal underline">
                  {order.invoiceUrl}
                </a>
              </p>
            )}
          </Card>
        ))}

        {consultations.map((c) => (
          <Card key={c.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-ink-900">Results consultation</p>
                <p className="text-xs text-ink-900/50">20 minutes</p>
              </div>
              <span className="rounded-pill bg-domain-hormonesBg px-3 py-1 text-xs font-medium text-domain-hormones">
                Scheduled
              </span>
            </div>
            {c.date && (
              <p className="mt-3 text-sm font-medium text-domain-hormones">
                {new Date(c.date).toLocaleDateString()} &middot; {c.start}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary">Reschedule</Button>
              <Button variant="secondary">Add to calendar</Button>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-ink-900/40">
        Orders, payment methods and invoices are held in Shopify. Kit, sample and result records are held by BioAro
        and linked to the order.
      </p>
    </div>
  );
}
