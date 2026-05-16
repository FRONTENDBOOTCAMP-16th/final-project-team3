'use client';

import { useCallback, useState } from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

const step2Schema = z
  .object({
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .regex(
        PASSWORD_REGEX,
        '영문, 숫자, 특수문자(!@#$%^&*)를 조합하여 8자 이상 입력해주세요.',
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

interface Step2FormProps {
  name: string;
  email: string;
  onNext: () => void;
}

export default function Step2Form({ name, email, onNext }: Step2FormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    server?: string;
  }>({});

  const handleSubmit = useCallback(async () => {
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
    setIsLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        setErrors({
          server: '비밀번호 재설정에 실패했습니다. 다시 시도해주세요.',
        });
        return;
      }
      onNext();
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, confirmPassword, onNext]);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          새 비밀번호
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            id="password"
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
          />
        </div>
        <p className="text-danger text-sm mt-1 h-10" role="alert">
          {errors.password ?? ''}
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          비밀번호 확인
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={!!errors.confirmPassword}
            className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
          />
        </div>
        <p className="text-danger text-sm mt-1 h-5" role="alert">
          {errors.confirmPassword ?? errors.server ?? ''}
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '재설정 중...' : '재설정 완료'}
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
  );
}
