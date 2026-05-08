import { Suspense } from 'react';
import MyPageClient from './MyPageClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MyPageClient />
    </Suspense>
  );
}
