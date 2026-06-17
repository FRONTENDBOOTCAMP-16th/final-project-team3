'use client';

import { useState } from 'react';
import { REPORT_REASONS } from '@/services/reportService';
import type { ReportReason } from '@/services/reportService';

const slideUpStyle = `
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_reason: ReportReason) => Promise<void>;
}

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [selected, setSelected] = useState<ReportReason | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await onSubmit(selected);
    } finally {
      setLoading(false);
      setSelected(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{slideUpStyle}</style>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-label="신고창 닫기"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden"
          style={{ animation: 'slide-up 0.2s ease-out' }}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2
                id="report-modal-title"
                className="text-base font-bold text-gray-900"
              >
                게시글 신고하기
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                신고 사유를 선택해주세요
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
              aria-label="닫기"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="px-5 py-3 space-y-1.5">
            {REPORT_REASONS.map((reason) => (
              <button
                type="button"
                key={reason}
                onClick={() => setSelected(reason)}
                aria-pressed={selected === reason}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all duration-150 cursor-pointer ${
                  selected === reason
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selected === reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {selected === reason && (
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                </span>
                {reason}
              </button>
            ))}
          </div>

          <div className="px-5 pt-2 pb-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selected || loading}
              aria-disabled={!selected || loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: selected ? '#ef4444' : '#d1d5db' }}
            >
              {loading ? '신고 중...' : '신고하기'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
