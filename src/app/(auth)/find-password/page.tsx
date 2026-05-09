'use client';

import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const step1Schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z.string().email('올바른 이메일 형식으로 작성해주세요.'),
});

const step2Schema = z
  .object({
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export default function FindPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    server?: string;
  }>({});
  const router = useRouter();

  return (
    <>
      <p className="text-text-secondary text-sm font-medium text-center mb-6">
        주짓수 커뮤니티에 오신 것을 환영합니다
      </p>

      <div className="max-w-150 w-full bg-bg-white rounded-[32px] p-8 shadow-sm border-none">
        <h2 className="text-2xl font-bold text-center text-text-primary mb-8">
          비밀번호 찾기
        </h2>

        {/* 탭 */}
        <div className="flex mb-8 border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-sm font-bold transition-all ${
              step === 1
                ? 'border-b-2 border-btn-focus text-btn-focus'
                : 'text-text-secondary'
            }`}
          >
            비밀번호 찾기
          </button>
          <button
            className={`flex-1 py-2 text-sm font-bold transition-all ${
              step === 2
                ? 'border-b-2 border-btn-focus text-btn-focus'
                : 'text-text-secondary'
            }`}
          >
            비밀번호 재설정
          </button>
        </div>
      </div>
    </>
  );
}
