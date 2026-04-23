'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, House, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ROUTES } from '@/src/constants/routes';
import { cn } from '@/src/lib/utils';

type ErrorScreenVariant = 'not-found' | 'error';

interface ErrorScreenProps {
  variant: ErrorScreenVariant;
  code: string;
  title: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

const actionButtonClassName =
  'h-12 min-w-[136px] cursor-pointer rounded-2xl px-6 text-base font-semibold shadow-none';

const primaryActionClassName =
  '!bg-error-button-primary !text-btn-focus-text hover:!bg-error-button-hover hover:!text-btn-focus-text';

const secondaryActionClassName =
  '!border-error-button-border !bg-error-button-secondary !text-text-primary hover:!border-error-button-hover hover:!bg-error-button-hover hover:!text-btn-focus-text';

export default function ErrorScreen({
  code,
  title,
  description,
  variant,
  onRetry,
  className,
}: ErrorScreenProps) {
  const router = useRouter();
  const isRuntimeError = variant === 'error';

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(ROUTES.HOME);
  };

  return (
    <main
      className={cn(
        'flex min-h-screen items-center justify-center bg-bg-page px-6 py-16',
        className,
      )}
    >
      <section
        aria-live={variant === 'error' ? 'assertive' : undefined}
        className="flex w-full max-w-[640px] flex-col items-center text-center"
      >
        <p
          className={cn(
            'text-[clamp(72px,18vw,160px)] font-extrabold leading-none tracking-[-0.06em]',
            isRuntimeError ? 'text-error-runtime' : 'text-error-not-found',
          )}
        >
          {code}
        </p>
        <h1 className="mt-6 text-[32px] font-bold tracking-[-0.03em] text-text-primary sm:text-[44px]">
          {title}
        </h1>
        <p className="mt-3 text-base text-text-secondary sm:text-lg">
          {description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {variant === 'error' && onRetry ? (
            <Button
              className={cn(actionButtonClassName, primaryActionClassName)}
              onClick={onRetry}
              type="button"
            >
              <RefreshCw className="size-[18px]" />
              다시 시도
            </Button>
          ) : (
            <Button
              asChild
              className={cn(actionButtonClassName, primaryActionClassName)}
            >
              <Link href={ROUTES.HOME}>
                <House className="size-[18px]" />
                홈으로
              </Link>
            </Button>
          )}

          {variant === 'error' ? (
            <Button
              asChild
              className={cn(actionButtonClassName, secondaryActionClassName)}
              variant="outline"
            >
              <Link href={ROUTES.HOME}>
                <House className="size-[18px]" />
                홈으로
              </Link>
            </Button>
          ) : (
            <Button
              className={cn(actionButtonClassName, secondaryActionClassName)}
              onClick={handleBack}
              type="button"
              variant="outline"
            >
              <ArrowLeft className="size-[18px]" />
              이전 페이지
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
