'use client';

import { useEffect } from 'react';
import type { ErrorInfo } from 'next/error';

import ErrorScreen from '@/src/components/error/ErrorScreen';
import '@/src/app/globals.css';

export default function GlobalErrorPage({ error, unstable_retry }: ErrorInfo) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="bg-bg-page">
        <title>문제가 발생했습니다</title>
        <ErrorScreen
          variant="error"
          code="ERROR"
          title="문제가 발생했습니다"
          description="서비스 화면을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
          onRetry={unstable_retry}
        />
      </body>
    </html>
  );
}
