'use client';

interface PostFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isLoading: boolean;
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
        className="flex-1 py-3 rounded-xl bg-btn-basic border border-gray-300 text-black hover:bg-gray-200 cursor-pointer"
      >
        취소
      </button>
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`flex-3 py-3 rounded-xl text-white text-sm font-medium transition-colors duration-200 ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black cursor-pointer'
        }`}
      >
        {isLoading ? '작성 중...' : submitLabel}
      </button>
    </div>
  );
}
