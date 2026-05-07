'use client';

interface PostFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

export default function PostFormActions({
  onCancel,
  onSubmit,
  submitLabel,
}: PostFormActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className="flex-1 py-3 rounded-xl bg-btn-basic border border-gray-300 text-black hover:bg-gray-200 cursor-pointer"
      >
        취소
      </button>
      <button
        onClick={onSubmit}
        className="flex-3 py-3 rounded-xl bg-black text-white text-sm font-medium cursor-pointer"
      >
        {submitLabel}
      </button>
    </div>
  );
}
