export default function LoadingSpinner() {
  return (
    <div
      className="col-span-2 flex items-center justify-center py-20"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-8 h-8 border-4 border-gray-200 border-t-btn-focus rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="sr-only">로딩 중</span>
    </div>
  );
}
