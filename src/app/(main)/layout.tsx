import ScrollToTop from '@/components/common/ScrollToTop';
import Sidebar from '@/components/layout/Sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Black Belt BJJ',
  description:
    '주짓수 수련자를 위한 올인원 커뮤니티. 커뮤니티, 대회일정, 도장찾기',
  openGraph: {
    siteName: 'Black Belt BJJ',
    title: 'Black Belt BJJ',
    description: '주짓수 수련자를 위한 올인원 커뮤니티',
    type: 'website',
  },
};

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
