import { Suspense } from 'react';
import DojangClient from '@/components/dojang/DojangClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '도장찾기 | Black Belt BJJ',
  description: '전국 주짓수 도장을 지도에서 찾아보세요.',
  openGraph: {
    title: '도장찾기 | Black Belt BJJ',
    description: '전국 주짓수 도장을 지도에서 찾아보세요.',
  },
};

export default function DojangsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DojangClient />
    </Suspense>
  );
}
