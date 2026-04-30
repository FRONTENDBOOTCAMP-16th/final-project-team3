'use client';

import { useState } from 'react';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {label}
      </label>
      {children}
      <p className="text-danger text-sm mt-1 h-5" />
    </div>
  );
}

function InputWithIcon({
  icon,
  type = 'text',
  placeholder,
}: {
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary flex items-center justify-center">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
      />
    </div>
  );
}

export default function RegisterPage() {
  const [tab, setTab] = useState<'general' | 'dojang'>('general');

  return (
    <>
      {/* 탭 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('general')}
          className={`flex-1 pb-3 text-sm font-bold transition-all ${
            tab === 'general'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          일반 회원
        </button>
        <button
          onClick={() => setTab('dojang')}
          className={`flex-1 pb-3 text-sm font-bold transition-all ${
            tab === 'dojang'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          도장 회원
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-text-primary mb-8">
        회원가입
      </h2>
    </>
  );
}
