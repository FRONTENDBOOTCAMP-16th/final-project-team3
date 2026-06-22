import ScrollToTop from '@/components/common/ScrollToTop';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import FooterWrapper from '@/components/layout/FooterWrapper';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Activio',
  description:
    '모든 스포츠 수련자를 위한 올인원 커뮤니티. 커뮤니티, 대회일정, 도장찾기',
  openGraph: {
    siteName: 'Activio',
    title: 'Activio',
    description: '모든 스포츠 수련자를 위한 올인원 커뮤니티',
    type: 'website',
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-bg-surface focus:text-text-primary focus:border focus:border-border focus:rounded-lg focus:text-sm focus:font-medium"
      >
        본문 바로가기
      </a>
      <Suspense>
        <TopNav />
      </Suspense>
      <main id="main-content" className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-7xl">{children}</div>
      </main>
      <Suspense>
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </Suspense>
      <ScrollToTop />
    </div>
  );
}
