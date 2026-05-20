import ScrollToTop from '@/components/common/ScrollToTop';
import Sidebar from '@/components/layout/Sidebar';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Suspense } from 'react';

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:border focus:border-gray-300 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        본문 바로가기
      </a>
      <div className="w-50 shrink-0" />
      <Suspense>
        <Sidebar />
      </Suspense>
      <main id="main-content" className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-7xl">{children}</div>
      </main>
      <ScrollToTop />
      <Toaster position="bottom-center" />
    </div>
  );
}
