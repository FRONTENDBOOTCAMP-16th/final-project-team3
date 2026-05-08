'use client';

import { useCallback } from 'react';

interface LimitedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  warnAt?: number;
  placeholder?: string;
  label?: string;
  rows?: number;
  allowNewline?: boolean; // false면 댓글처럼 줄바꿈 차단
  disabled?: boolean;
  className?: string;
}

export function LimitedTextarea({
  value,
  onChange,
  maxLength,
  warnAt,
  placeholder,
  label,
  rows = 4,
  allowNewline = true,
  disabled,
  className,
}: LimitedTextareaProps) {
  const threshold = warnAt ?? Math.floor(maxLength * 0.8);
  const len = value.length;
  const isWarn = len >= threshold && len < maxLength;
  const isError = len >= maxLength;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let next = e.target.value.slice(0, maxLength);
      if (!allowNewline) next = next.replace(/\n/g, '');
      onChange(next);
    },
    [onChange, maxLength, allowNewline],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!allowNewline && e.key === 'Enter') e.preventDefault();
    },
    [allowNewline],
  );

  const counterColor = isError
    ? 'text-red-500'
    : isWarn
      ? 'text-yellow-500'
      : 'text-gray-400';

  const borderColor = isError
    ? 'border-red-400 focus:ring-red-400'
    : isWarn
      ? 'border-yellow-400 focus:ring-yellow-400'
      : 'border-gray-300 focus:ring-blue-400';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`w-full px-3 py-2 pb-6 text-sm border rounded-lg resize-none
            focus:outline-none focus:ring-1 transition-colors
            disabled:bg-gray-50 disabled:text-gray-400
            ${borderColor}`}
        />
        <span className={`absolute right-3 bottom-2 text-xs ${counterColor}`}>
          {len.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>
      {isError && (
        <p className="mt-1 text-xs text-red-500">
          최대 {maxLength.toLocaleString()}자까지 입력할 수 있어요
        </p>
      )}
    </div>
  );
}
