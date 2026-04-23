import ScrollToTop from '@/src/components/common/ScrollToTop';
import Sidebar from '@/src/components/layout/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="w-50 shrink-0" />
      <Sidebar />
      <main className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-7xl">{children}</div>
      </main>
      <ScrollToTop />
    </div>
  );
}
