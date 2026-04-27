'use client';

import { useEffect } from 'react';
import type { ErrorInfo } from 'next/error';
import ErrorScreen from '@/src/components/error/ErrorScreen';

export default function ErrorPage({ error, unstable_retry }: ErrorInfo) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      variant="error"
      code="ERROR"
      title="문제가 발생했습니다"
      description="일시적인 문제일 수 있습니다. 잠시 후 다시 시도해주세요."
      onRetry={unstable_retry}
    />
  );
}
