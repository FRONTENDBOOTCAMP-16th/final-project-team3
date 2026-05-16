'use client';

import { useCallback, useState } from 'react';
import { Mail, User } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';

const step1Schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z.string().email('올바른 이메일 형식으로 작성해주세요.'),
});

interface Step1FormProps {
  name: string;
  email: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  onNext: () => void;
}

export default function Step1Form({
  name,
  email,
  setName,
  setEmail,
  onNext,
}: Step1FormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    server?: string;
  }>({});

  const handleSubmit = useCallback(async () => {
    const result = step1Schema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({ name: fieldErrors.name?.[0], email: fieldErrors.email?.[0] });
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, checkOnly: true }),
      });

      if (!res.ok) {
        setErrors({ server: '이름 또는 이메일이 올바르지 않습니다.' });
        return;
      }
      onNext();
    } finally {
      setIsLoading(false);
    }
  }, [name, email, onNext]);

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
          htmlFor="name"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          이름
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
          />
        </div>
        <p className="text-danger text-sm mt-1 h-5" role="alert">
          {errors.name ?? ''}
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-primary mb-2 h-5 "
        >
          이메일
        </label>
        <div className="relative ">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            className=" w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
          />
        </div>
        <p className="text-danger text-sm mt-1 h-10" role="alert">
          {errors.email ?? errors.server ?? ''}
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '확인 중...' : '비밀번호 재설정'}
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
