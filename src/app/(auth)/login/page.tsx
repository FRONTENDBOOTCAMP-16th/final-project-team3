'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-page p-6">
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
          유도 & 주짓수 커뮤니티에 오신 것을 환영합니다
        </p>
      </div>

      <div className="max-w-[480px] w-full bg-bg-white rounded-[32px] p-8 shadow-sm border border-border">
        <h2 className="text-2xl font-bold text-center text-text-primary mb-8">
          로그인
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F1F3F5] border-none rounded-2xl py-4 pl-12 pr-4 text-base focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F1F3F5] border-none rounded-2xl py-4 pl-12 pr-4 text-base focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>
          <button className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all mt-4">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
