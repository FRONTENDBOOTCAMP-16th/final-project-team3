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
  const handleStep1 = async () => {
    const result = step1Schema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
      });
      return;
    }
    setErrors({});
    const handleStep2 = async () => {
      const result = step2Schema.safeParse({ password, confirmPassword });
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors({
          password: fieldErrors.password?.[0],
          confirmPassword: fieldErrors.confirmPassword?.[0],
        });
        return;
      }
      setErrors({});

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrors({
          server: '비밀번호 재설정에 실패했습니다. 다시 시도해주세요.',
        });
        return;
      }

      router.push('/login');
    };
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email_value', email)
      .eq('name', name)
      .single();

    if (error || !data) {
      setErrors({
        server: '입력하신 이메일로 가입된 계정을 찾을 수 없습니다.',
      });
      return;
    }

    setStep(2);
  };

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
        {step === 1 ? (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleStep1();
            }}
          >
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
                />
              </div>
              <p className="text-danger text-sm mt-1 h-5">
                {errors.name ?? ''}
              </p>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
                />
              </div>
              <p className="text-danger text-sm mt-1 h-5">
                {errors.email ?? ''}
              </p>
            </div>

            <p className="text-danger text-sm text-center h-5">
              {errors.server ?? ''}
            </p>

            <button
              type="submit"
              className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer"
            >
              비밀번호 재설정
            </button>

            <p className="text-center text-sm text-text-secondary">
              로그인으로 돌아가기{' '}
              <Link
                href="/login"
                className="font-bold hover:underline"
                style={{ color: 'var(--color-auth-register)' }}
              >
                로그인
              </Link>
            </p>
          </form>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleStep2();
            }}
          >
            {/* 새 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                새 비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
                />
              </div>
              <p className="text-danger text-sm mt-1 h-5">
                {errors.password ?? ''}
              </p>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
                />
              </div>
              <p className="text-danger text-sm mt-1 h-5">
                {errors.confirmPassword ?? ''}
              </p>
            </div>

            <p className="text-danger text-sm text-center h-5">
              {errors.server ?? ''}
            </p>

            <button
              type="submit"
              className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer"
            >
              비밀번호 재설정
            </button>

            <p className="text-center text-sm text-text-secondary">
              로그인으로 돌아가기{' '}
              <Link
                href="/login"
                className="font-bold hover:underline"
                style={{ color: 'var(--color-auth-register)' }}
              >
                로그인
              </Link>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
