import { cn } from '@/lib/utils';
import ErrorScreenActions from './ErrorScreenActions';

type ErrorScreenVariant = 'not-found' | 'error';

interface ErrorScreenProps {
  variant: ErrorScreenVariant;
  code: string;
  title: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorScreen({
  code,
  title,
  description,
  variant,
  onRetry,
  className,
}: ErrorScreenProps) {
  const isRuntimeError = variant === 'error';

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

        <h1 className="mt-6 text-[32px] font-bold text-text-primary sm:text-[44px]">
          {title}
        </h1>

        <p className="mt-3 text-base text-text-secondary sm:text-lg">
          {description}
        </p>

        <ErrorScreenActions variant={variant} onRetry={onRetry} />
      </section>
    </main>
  );
}
