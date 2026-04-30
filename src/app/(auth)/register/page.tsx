'use client';

import { useState } from 'react';

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
