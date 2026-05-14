'use client';

interface PostFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isLoading?: boolean;
}

export default function PostFormActions({
  onCancel,
  onSubmit,
  submitLabel,
  isLoading = false,
}: PostFormActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1 py-3 rounded-xl bg-btn-basic border border-border text-text-primary hover:bg-btn-basic cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        취소
      </button>
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`flex-3 py-3 rounded-xl text-btn-focus-text text-sm font-medium transition-colors duration-200 ${
          isLoading
            ? 'bg-btn-basic cursor-not-allowed'
            : 'bg-btn-focus cursor-pointer'
        }`}
      >
        {isLoading ? '처리 중...' : submitLabel}
      </button>
    </div>
  );
}
