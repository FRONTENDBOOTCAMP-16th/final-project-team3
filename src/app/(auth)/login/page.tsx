'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-page px-10 py-6">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-40 h-20 mb-3">
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

      <div className="max-w-[600px] w-full bg-bg-white rounded-[32px] p-8 shadow-sm border-none">
        <h2 className="text-2xl font-bold text-center text-text-primary mb-8">
          로그인
        </h2>

        <form className="space-y-5">
          <div>
            {/* 이메일 입력 */}
            <label className="block text-sm font-medium text-text-primary mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
              />
            </div>
          </div>
          <div>
            {/* 비밀번호 입력 */}
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
              />
            </div>
          </div>
          {/* 로그인 상태 유지 */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                className="w-4 h-4 rounded accent-black"
              />
              <span className="font-bold text-sm text-text-secondary">
                로그인 상태 유지
              </span>
            </label>
            {/* Next.js에서는 a태그 대신 Link 사용 권장 */}
            <Link
              href="/forgot-password"
              className="text-sm text-text-primary font-medium hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
          <button className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all mt-4">
            로그인
          </button>
          <p className="text-center text-sm text-text-secondary">
            아직 회원이 아니신가요?{' '}
            {/* Next.js에서는 a태그 대신 Link 사용 권장 */}
            <Link
              href="/signup"
              className="font-bold text-text-primary hover:underline"
            >
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
