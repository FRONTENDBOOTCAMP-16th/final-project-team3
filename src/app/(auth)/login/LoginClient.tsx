'use client';

import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import useAuthStore from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식으로 작성해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    server?: string;
  }>({});
  const router = useRouter();

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    setErrors({});

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message === 'Invalid login credentials') {
        setErrors({ server: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      } else if (error.message === 'Request rate limit reached') {
        setErrors({ server: '잠시 후 다시 시도해주세요.' });
      } else {
        setErrors({
          server: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
        });
      }
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname, role')
      .eq('id', data.user.id)
      .single();

    useAuthStore.getState().setUser({
      id: data.user.id,
      email: data.user.email ?? '',
      nickname: profile?.nickname ?? '',
      role: profile?.role ?? '',
    });

    const role = profile?.role ?? '';
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'manager') {
      router.push('/community');
    } else {
      router.push('/community');
    }
  };
  return (
    <>
      <p className="text-text-secondary text-sm font-medium text-center mb-6">
        주짓수 커뮤니티에 오신 것을 환영합니다
      </p>

      {/* 카드 */}
      <div className="max-w-150 w-full bg-bg-white rounded-[32px] p-8 shadow-sm border-none">
        <h2 className="text-2xl font-bold text-center text-text-primary mb-8">
          로그인
        </h2>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
              />
            </div>

            <p className="text-danger text-sm mt-1 h-5">{errors.email ?? ''}</p>
          </div>
          <div>
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

            <p className="text-danger text-sm mt-1 h-5">
              {errors.password ?? ''}
            </p>
          </div>
          <div className="flex justify-end -mt-5 -mb-5">
            <Link
              href="/find-password"
              className="text-sm font-bold hover:underline text-[#4f74e8]"
            >
              비밀번호 찾기
            </Link>
          </div>

          <p className="text-danger text-sm text-center h-5">
            {errors.server ?? ''}
          </p>

          <button
            type="submit"
            className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer"
          >
            로그인
          </button>
          <p className="text-center text-sm text-text-secondary">
            아직 회원이 아니신가요?{' '}
            <Link
              href="/register"
              className="font-bold hover:underline"
              style={{ color: 'var(--color-auth-register)' }}
            >
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
