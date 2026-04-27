'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, House, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ROUTES } from '@/src/constants/routes';
import { cn } from '@/src/lib/utils';

type ErrorScreenVariant = 'not-found' | 'error';
interface Props {
  variant: ErrorScreenVariant;
  onRetry?: () => void;
}

const buttonBase =
  'h-12 min-w-[136px] cursor-pointer rounded-2xl px-6 font-semibold border-2 border-[var(--color-btn-focus)] bg-white text-black transition-colors duration-200 hover:text-white';

export default function ErrorScreenActions({ variant, onRetry }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(ROUTES.HOME);
  };

  const isError = variant !== 'not-found';
  const buttonHover =
    variant === 'not-found'
      ? 'hover:!bg-[var(--color-error-not-found)] hover:text-white'
      : 'hover:!bg-[var(--color-error-runtime)] hover:text-white';

  return (
    <nav
      aria-label="오류 페이지 동작"
      className="mt-10 flex flex-wrap items-center justify-center gap-3"
    >
      <Button asChild type="button" className={cn(buttonBase, buttonHover)}>
        <Link href={ROUTES.HOME}>
          <House className="size-[18px]" />
          홈으로
        </Link>
      </Button>

      {/* 조건부 버튼 */}
      {isError ? (
        <Button onClick={onRetry} className={cn(buttonBase, buttonHover)}>
          <RefreshCw className="size-[18px]" />
          다시 시도
        </Button>
      ) : (
        <Button onClick={handleBack} className={cn(buttonBase, buttonHover)}>
          <ArrowLeft className="size-[18px]" />
          이전 페이지
        </Button>
      )}
    </nav>
  );
}
