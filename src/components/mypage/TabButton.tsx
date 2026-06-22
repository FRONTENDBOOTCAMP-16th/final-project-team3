'use client';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TabButton({
  label,
  isActive,
  onClick,
}: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={isActive}
      role="tab"
      className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm border cursor-pointer ${
        isActive
          ? 'bg-btn-focus text-btn-focus-text border-btn-focus'
          : 'bg-bg-surface text-text-secondary border-gray-100 hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  );
}
