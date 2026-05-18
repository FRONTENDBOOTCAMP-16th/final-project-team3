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
      className={cn(
        'col-span-2 flex items-center justify-center py-20',
        className,
      )}
    >
      <div
        className="w-8 h-8 border-4 border-gray-200 border-t-btn-focus rounded-full animate-spin"
        aria-label={label}
      />
    </div>
  );
}
