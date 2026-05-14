'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, House, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

type ErrorScreenVariant = 'not-found' | 'error';
interface Props {
  variant: ErrorScreenVariant;
  onRetry?: () => void;
}

const buttonBase =
  'h-12 min-w-[136px] cursor-pointer rounded-2xl px-6 font-semibold border-2 border-btn-focus bg-bg-white text-text-primary transition-colors duration-200 hover:text-btn-focus-text';

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
      ? 'hover:!bg-[var(--color-error-not-found)] hover:text-btn-focus-text'
      : 'hover:!bg-[var(--color-error-runtime)] hover:text-btn-focus-text';

  return (
    <nav
      aria-label="오류 페이지 동작"
      className="mt-10 flex flex-wrap items-center justify-center gap-3"
    >
      <Button asChild type="button" className={cn(buttonBase, buttonHover)}>
        <Link href={ROUTES.HOME}>
          <House className="size-4.5" />
          홈으로
        </Link>
      </Button>

      {isError ? (
        <Button onClick={onRetry} className={cn(buttonBase, buttonHover)}>
          <RefreshCw className="size-4.5" />
          다시 시도
        </Button>
      ) : (
        <Button onClick={handleBack} className={cn(buttonBase, buttonHover)}>
          <ArrowLeft className="size-4.5" />
          이전 페이지
        </Button>
      )}
    </nav>
  );
}
