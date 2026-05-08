'use client';

import { useState, useCallback } from 'react';

interface LimitedInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  warnAt?: number; // 생략 시 maxLength의 80%
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  'aria-required'?: boolean | 'true' | 'false';
}

export function LimitedInput({
  id,
  value,
  onChange,
  maxLength,
  warnAt,
  placeholder,
  label,
  disabled,
  className,
  'aria-required': ariaRequired,
}: LimitedInputProps) {
  const threshold = warnAt ?? Math.floor(maxLength * 0.8);
  const len = value.length;
  const isWarn = len >= threshold && len < maxLength;
  const isError = len >= maxLength;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value.slice(0, maxLength));
    },
    [onChange, maxLength],
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
        <input
          aria-required={ariaRequired}
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full pr-20 px-3 py-2 text-sm border rounded-lg
            focus:outline-none focus:ring-1 transition-colors
            disabled:bg-gray-50 disabled:text-gray-400
            ${borderColor}`}
        />
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${counterColor}`}
        >
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
