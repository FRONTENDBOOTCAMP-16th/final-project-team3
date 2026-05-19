'use client';

import { useCallback, useRef } from 'react';

interface LimitedTextareaProps {
  id?: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  maxLength: number;
  warnAt?: number;
  placeholder?: string;
  label?: string;
  rows?: number;
  allowNewline?: boolean;
  disabled?: boolean;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function LimitedTextarea({
  id,
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
  onKeyDown,
}: LimitedTextareaProps) {
  const threshold = warnAt ?? Math.floor(maxLength * 0.8);
  const len = value.length;
  const isWarn = len >= threshold && len < maxLength;
  const isError = len >= maxLength;
  const isComposingRef = useRef(false);

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
      if (isComposingRef.current) return;
      onKeyDown?.(e);
    },
    [allowNewline, onKeyDown],
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
          id={id}
          value={value}
          onChange={handleChange}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
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
