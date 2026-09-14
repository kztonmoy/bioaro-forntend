"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import { LogoutButton } from '../auth/LogoutButton';

// Primary items mirror the sidebar order shown on screen 01. Orders and
// Share-with-a-clinician are surfaced too (as a "More" group) since they
// are still first-class screens in the design review, just not pictured
// in that one sidebar screenshot.
const PRIMARY_NAV = [
  { href: '/', label: 'Overview', icon: 'home' },
  { href: '/results', label: 'All results', icon: 'list', badge: '28' },
  { href: '/trends', label: 'Change over time', icon: 'trend' },
  { href: '/recommendations', label: 'Recommendations', icon: 'bookmark' },
  { href: '/kits', label: 'Tests & kits', icon: 'kit' },
  { href: '/consents', label: 'Consents & intake', icon: 'consent', dot: true },
  { href: '/profile', label: 'Profile & settings', icon: 'user' },
];

const MORE_NAV = [
  { href: '/orders', label: 'Orders' },
  { href: '/sharing', label: 'Share with a clinician' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 flex-col bg-ink-900 px-5 py-6 text-white lg:flex">
      <div className="mb-8 flex items-center gap-2 px-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-ink-900">
          B
        </span>
        <span className="font-display text-sm font-semibold">BioAro Labs</span>
      </div>

      <div className="mb-6 px-1">
        <p className="font-display text-lg font-semibold leading-tight">Inflammation &amp; Longevity</p>
        <p className="mt-1 text-xs text-white/50">28-marker panel &middot; collected 9 Feb 2026</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {PRIMARY_NAV.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center justify-between rounded px-3 py-2 text-sm transition-colors',
                active ? 'bg-white text-ink-900 font-medium' : 'text-white/80 hover:bg-white/10',
              )}
            >
              <span className="flex items-center gap-2">
                {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-status-watch" />}
                {item.label}
              </span>
              {item.badge && <span className="text-xs text-white/40">{item.badge}</span>}
            </Link>
          );
        })}

        <div className="mt-4 border-t border-white/10 pt-4">
          {MORE_NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'block rounded px-3 py-2 text-sm transition-colors',
                  active ? 'bg-white text-ink-900 font-medium' : 'text-white/70 hover:bg-white/10',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-6 rounded-card bg-white/10 p-4">
        <p className="text-sm font-medium">Questions about your results?</p>
        <p className="mt-1 text-xs text-white/60">Book a consultation with our care team.</p>
        <Button href="/orders" variant="secondary" className="mt-3 w-full bg-white/90 text-ink-900 hover:bg-white">
          Book consultation
        </Button>
      </div>

      <LogoutButton className="mt-4 px-3 text-left text-xs text-white/40 hover:text-white/70" />
    </aside>
  );
}
