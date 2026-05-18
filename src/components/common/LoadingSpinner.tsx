import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export default function LoadingSpinner({
  className,
  label = '로딩 중',
}: LoadingSpinnerProps = {}) {
  return (
    <div
      className={cn('flex items-center justify-center py-20', className)}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-8 h-8 border-4 border-gray-200 border-t-btn-focus rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
