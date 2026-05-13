import { Suspense } from 'react';
import MyPageClient from './MyPageClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '마이페이지 | Black Belt BJJ',
  description: '내 프로필과 활동 내역을 확인하세요',
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MyPageClient />
    </Suspense>
  );
}
