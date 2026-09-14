"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const TABS = [
  { href: '/', label: 'Overview' },
  { href: '/results', label: 'Results' },
  { href: '/kits', label: 'Tests' },
  { href: '/consents', label: 'Forms', dot: true },
  { href: '/profile', label: 'You' },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-cream-line bg-cream-card lg:hidden">
      {TABS.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              'relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs',
              active ? 'text-ink-900 font-medium' : 'text-ink-900/50',
            )}
          >
            <span className={clsx('h-5 w-5 rounded-full', active ? 'bg-ink-900' : 'bg-ink-900/15')} />
            {tab.label}
            {tab.dot && <span className="absolute right-6 top-1 h-1.5 w-1.5 rounded-full bg-status-watch" />}
          </Link>
        );
      })}
    </nav>
  );
}
