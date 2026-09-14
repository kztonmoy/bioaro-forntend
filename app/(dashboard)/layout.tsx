import { Sidebar } from '@/components/layout/Sidebar';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex-1">
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 lg:px-8 lg:pb-10 lg:pt-8">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
