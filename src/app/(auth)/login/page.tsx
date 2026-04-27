'use client';

import React from 'react';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page p-6">
      <div className="max-w-[450px] border-none w-full bg-bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-border">
        {/* 로고 부분 */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-40 h-20 mb-4">
            <Image
              src="/blackbelt.svg"
              alt="Black Belt Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-text-secondary text-sm font-medium text-center">
            주짓수 커뮤니티에 오신 것을 환영합니다
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-text-primary mb-10">
          로그인
        </h2>
        {/* 이메일 입력 */}
        <form className="space-y-5">
          <input
            type="email"
            placeholder="이메일"
            className="w-full p-4 bg-input-bg border border-border rounded-2xl outline-none border-none text-input-text placeholder:text-text-secondary"
          />
          {/* 비밀번호 입력 */}
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-4 bg-input-bg border border-border rounded-2xl outline-none border-none text-input-text placeholder:text-text-secondary"
          />

          {/* 로그인 버튼 */}
          <button className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all mt-4">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
