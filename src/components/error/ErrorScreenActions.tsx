'use client';

import type { ReactNode } from 'react';
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

interface ActionGroup {
  primary: ReactNode;
  secondary?: ReactNode;
}

const buttonBase =
  'h-12 min-w-[136px] cursor-pointer rounded-2xl px-6 text-base font-semibold';

const notFoundPrimaryButton =
  '!bg-error-not-found-button !text-btn-focus-text hover:!bg-error-not-found-button-hover hover:!text-btn-focus-text';

const runtimePrimaryButton =
  '!bg-error-runtime-button !text-btn-focus-text hover:!bg-error-runtime-button-hover hover:!text-btn-focus-text';

const neutralSecondaryButton =
  '!border-error-button-border !bg-error-button-secondary !text-text-primary hover:!border-error-button-border hover:!bg-error-button-secondary-hover hover:!text-text-primary';

export default function ErrorScreenActions({ variant, onRetry }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(ROUTES.HOME);
  };

  const getActions = (): ActionGroup => {
    switch (variant) {
      case 'error':
        if (onRetry) {
          return {
            primary: (
              <Button
                type="button"
                onClick={onRetry}
                className={cn(buttonBase, runtimePrimaryButton)}
              >
                <RefreshCw className="size-[18px]" />
                다시 시도
              </Button>
            ),
            secondary: (
              <Button
                asChild
                type="button"
                variant="outline"
                className={cn(buttonBase, neutralSecondaryButton)}
              >
                <Link href={ROUTES.HOME}>
                  <House className="size-[18px]" />
                  홈으로
                </Link>
              </Button>
            ),
          };
        }

        return {
          primary: (
              <Button
                asChild
                type="button"
                className={cn(buttonBase, runtimePrimaryButton)}
              >
              <Link href={ROUTES.HOME}>
                <House className="size-[18px]" />
                홈으로
              </Link>
            </Button>
          ),
        };

      case 'not-found':
        return {
          primary: (
              <Button
                asChild
                type="button"
                className={cn(buttonBase, notFoundPrimaryButton)}
              >
              <Link href={ROUTES.HOME}>
                <House className="size-[18px]" />
                홈으로
              </Link>
            </Button>
          ),
          secondary: (
            <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className={cn(buttonBase, neutralSecondaryButton)}
              >
              <ArrowLeft className="size-[18px]" />
              이전 페이지
            </Button>
          ),
        };

      default:
        return {
          primary: (
              <Button
                asChild
                type="button"
                className={cn(buttonBase, runtimePrimaryButton)}
              >
              <Link href={ROUTES.HOME}>
                <House className="size-[18px]" />
                홈으로
              </Link>
            </Button>
          ),
        };
    }
  };

  const { primary, secondary } = getActions();

  return (
    <nav
      aria-label="오류 페이지 동작"
      className="mt-10 flex flex-wrap items-center justify-center gap-3"
    >
      {primary}
      {secondary}
    </nav>
  );
}
