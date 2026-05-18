'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { registerGeneral } from '@/services/authService';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import Field from '@/components/common/Field';
import InputWithIcon from '@/components/common/InputWithIcon';
import BeltSelect from './components/BeltSelect';
import NicknameField from './components/NicknameField';
import PasswordStrength from './components/PasswordStrength';
import { useNicknameCheck } from '@/hooks/useNicknameCheck';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

const generalSchema = z
  .object({
    name: z.string().optional(),
    nickname: z
      .string()
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(10, '닉네임은 10자 이하여야 합니다.'),
    email: z.string().email('올바른 이메일 형식으로 입력해주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .regex(PASSWORD_REGEX, '영문, 숫자, 특수문자를 모두 포함해야 합니다.'),
    passwordCheck: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    belt: z.string().min(1, '벨트를 선택해주세요.'),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

type GeneralFormType = z.infer<typeof generalSchema>;

export default function GeneralForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<GeneralFormType>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      passwordCheck: '',
      belt: '',
    },
  });

  useEffect(() => {
    reset();
    setServerError('');
  }, [reset]);

  const nickname = watch('nickname');
  const beltValue = watch('belt');
  const password = watch('password');
  const { nicknameStatus } = useNicknameCheck(nickname);

  const onSubmit = async (data: GeneralFormType) => {
    if (nicknameStatus !== 'available') {
      showErrorToast('닉네임 중복확인을 완료해주세요!');
      return;
    }
    setIsLoading(true);
    setServerError('');

    try {
      await registerGeneral({
        email: data.email,
        password: data.password,
        name: data.name,
        nickname: data.nickname,
        belt: data.belt,
      });
      showSuccessToast('회원가입이 완료되었습니다! 로그인해주세요 🎉');
      router.push('/login');
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('already registered')
      ) {
        setServerError('이미 가입된 이메일입니다. 다른 이메일로 시도해주세요.');
      } else {
        setServerError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Field label="이름" htmlFor="name">
        <InputWithIcon
          id="name"
          icon={<User className="w-5 h-5" />}
          placeholder="이름을 입력하세요"
          {...register('name')}
        />
        <div className="h-5 mt-1">
          {errors.name && (
            <p className="text-danger text-sm" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
      </Field>

      <NicknameField
        id="nickname"
        register={register}
        errors={errors}
        nicknameStatus={nicknameStatus}
      />

      <Field label="이메일" htmlFor="email">
        <InputWithIcon
          id="email"
          icon={<Mail className="w-5 h-5" />}
          type="email"
          placeholder="이메일을 입력하세요"
          {...register('email')}
        />
        <div className="h-5 mt-1">
          {errors.email && (
            <p className="text-danger text-sm" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </Field>

      <Field label="비밀번호" htmlFor="password">
        <InputWithIcon
          id="password"
          icon={<Lock className="w-5 h-5" />}
          type="password"
          placeholder="비밀번호를 입력하세요"
          {...register('password')}
        />
        <PasswordStrength password={password} />
        <div className="h-5 mt-1">
          {errors.password && (
            <p className="text-danger text-sm" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
      </Field>

      <Field label="비밀번호 확인" htmlFor="passwordCheck">
        <InputWithIcon
          id="passwordCheck"
          icon={<Lock className="w-5 h-5" />}
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          {...register('passwordCheck')}
        />
        <div className="h-5 mt-1">
          {errors.passwordCheck && (
            <p className="text-danger text-sm" role="alert">
              {errors.passwordCheck.message}
            </p>
          )}
        </div>
      </Field>

      <Field label="벨트" htmlFor="belt">
        <BeltSelect id="belt" value={beltValue} {...register('belt')} />
        <div className="h-5 mt-1">
          {errors.belt && (
            <p className="text-danger text-sm" role="alert">
              {errors.belt.message}
            </p>
          )}
        </div>
      </Field>

      <div className="h-5 text-center">
        {serverError && (
          <p className="text-danger text-sm" role="alert">
            {serverError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '가입 중...' : '가입하기'}
      </button>

      <p className="text-center text-sm text-text-secondary">
        이미 계정이 있으신가요?{' '}
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
