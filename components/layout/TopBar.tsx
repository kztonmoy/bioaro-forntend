import { OVERVIEW } from '@/lib/mock-data';
import { isLiveApiConfigured } from '@/lib/api';
import { LogoutButton } from '@/components/auth/LogoutButton';

// The "Good afternoon, Shayan" strip from screen 01, reused across
// dashboard pages above the page-specific header.
export function TopBar() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-cream-line pb-4">
      <div>
        <p className="font-display text-lg font-semibold text-ink-900">Good afternoon, {OVERVIEW.patientName}</p>
        <p className="text-sm text-ink-900/50">
          Your results were reviewed and released on {OVERVIEW.reportDate}.
          {!isLiveApiConfigured() && (
            <span className="ml-2 rounded-pill bg-status-watchBg px-2 py-0.5 text-xs font-medium text-status-watch">
              Sample data — API not configured
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs text-ink-900/50">
        <div>
          <p className="uppercase tracking-wide">Test ID</p>
          <p className="font-medium text-ink-900">{OVERVIEW.testId}</p>
        </div>
        <div>
          <p className="uppercase tracking-wide">Report date</p>
          <p className="font-medium text-ink-900">{OVERVIEW.reportDate}</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
          SH
        </span>
        <LogoutButton className="hidden text-ink-900/40 hover:text-ink-900 lg:inline" />
      </div>
    </div>
  );
}
