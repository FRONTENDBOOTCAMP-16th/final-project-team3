'use client';

import { useState } from 'react';
import GeneralForm from './GeneralForm';
import DojangForm from './DojangForm';

export type RegisterTab = 'general' | 'dojang';

export default function RegisterClient() {
  const [tab, setTab] = useState<RegisterTab>('general');

  return (
    <>
      <div role="tablist" className="flex border-b border-gray-200 mb-6">
        <button
          role="tab"
          aria-selected={tab === 'general'}
          onClick={() => setTab('general')}
          className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
            tab === 'general'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          일반 회원
        </button>
        <button
          role="tab"
          aria-selected={tab === 'dojang'}
          onClick={() => setTab('dojang')}
          className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
            tab === 'dojang'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          도장 회원
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-text-primary mb-5 mt-10">
        회원가입
      </h2>

      {tab === 'general' ? <GeneralForm /> : <DojangForm />}
    </>
  );
}
