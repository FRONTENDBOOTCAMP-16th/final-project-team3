'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { registerDojang, uploadBusinessFile } from '@/services/authService';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import Field from '@/components/common/Field';
import InputWithIcon from '@/components/common/InputWithIcon';
import BeltSelect from './components/BeltSelect';
import NicknameField from './components/NicknameField';
import BusinessFileUpload from './components/BusinessFileUpload';
import PasswordStrength from './components/PasswordStrength';
import { useNicknameCheck } from '@/hooks/useNicknameCheck';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

const dojangSchema = z
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
    licenseNumber: z
      .string()
      .min(1, '사업자등록번호를 입력해주세요.')
      .regex(/^\d{10}$/, '사업자등록번호는 숫자 10자리로 입력해주세요.'),
    ownerName: z.string().min(1, '대표자명을 입력해주세요.'),
    phone: z
      .string()
      .min(1, '연락처를 입력해주세요.')
      .regex(
        /^\d{2,3}-\d{3,4}-\d{4}$/,
        '올바른 형식으로 입력해주세요. (예: 010-0000-0000)',
      ),
    address: z.string().min(1, '주소를 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

type DojangFormType = z.infer<typeof dojangSchema>;

export default function DojangForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [businessFile, setBusinessFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<DojangFormType>({
    resolver: zodResolver(dojangSchema),
    defaultValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      passwordCheck: '',
      belt: '',
      licenseNumber: '',
      ownerName: '',
      phone: '',
      address: '',
    },
  });

  const nickname = useWatch({ control, name: 'nickname' });
  const beltValue = useWatch({ control, name: 'belt' });
  const password = useWatch({ control, name: 'password' });
  const { nicknameStatus } = useNicknameCheck(nickname);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: { address: string }) => {
        setValue('address', data.address, { shouldValidate: true });
      },
    }).open();
  };

  const onSubmit = async (data: DojangFormType) => {
    if (nicknameStatus !== 'available') {
      showErrorToast('닉네임 중복확인을 완료해주세요!');
      return;
    }
    if (!businessFile) {
      setServerError('사업자등록증을 첨부해주세요.');
      return;
    }
    setIsLoading(true);
    setServerError('');

    try {
      setIsUploading(true);
      const businessFileUrl = await uploadBusinessFile(businessFile);
      setIsUploading(false);
      await registerDojang({
        email: data.email,
        password: data.password,
        name: data.name,
        nickname: data.nickname,
        belt: data.belt,
        licenseNumber: data.licenseNumber,
        ownerName: data.ownerName,
        phone: data.phone,
        address: data.address,
        businessFileUrl,
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
      setIsUploading(false);
    }
  };

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Field label="대표자명" htmlFor="ownerName">
          <InputWithIcon
            id="ownerName"
            icon={<User className="w-5 h-5" />}
            placeholder="대표자명"
            {...register('ownerName')}
          />
          <div className="h-5 mt-1">
            {errors.ownerName && (
              <p className="text-danger text-sm" role="alert">
                {errors.ownerName.message}
              </p>
            )}
          </div>
        </Field>

        <NicknameField
          id="dojang-nickname"
          register={register}
          errors={errors}
          nicknameStatus={nicknameStatus}
        />

        <Field label="이메일" htmlFor="dojang-email">
          <InputWithIcon
            id="dojang-email"
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

        <Field label="비밀번호" htmlFor="dojang-password">
          <InputWithIcon
            id="dojang-password"
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

        <Field label="비밀번호 확인" htmlFor="dojang-passwordCheck">
          <InputWithIcon
            id="dojang-passwordCheck"
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

        <Field label="벨트" htmlFor="dojang-belt">
          <BeltSelect
            id="dojang-belt"
            value={beltValue}
            {...register('belt')}
          />
          <div className="h-5 mt-1">
            {errors.belt && (
              <p className="text-danger text-sm" role="alert">
                {errors.belt.message}
              </p>
            )}
          </div>
        </Field>

        <Field label="도장명" htmlFor="dojang-name">
          <InputWithIcon
            id="dojang-name"
            icon={<User className="w-5 h-5" />}
            placeholder="도장명을 입력하세요"
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

        <Field label="사업자등록번호" htmlFor="licenseNumber">
          <InputWithIcon
            id="licenseNumber"
            icon={<CreditCard className="w-5 h-5" />}
            placeholder="사업자등록번호를 입력하세요 (숫자만)"
            {...register('licenseNumber')}
          />
          <div className="h-5 mt-1">
            {errors.licenseNumber && (
              <p className="text-danger text-sm" role="alert">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>
        </Field>

        <Field label="연락처" htmlFor="phone">
          <InputWithIcon
            id="phone"
            icon={<Phone className="w-5 h-5" />}
            type="tel"
            placeholder="010-0000-0000"
            {...register('phone')}
          />
          <div className="h-5 mt-1">
            {errors.phone && (
              <p className="text-danger text-sm" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
        </Field>

        <Field label="주소" htmlFor="address">
          <div className="flex gap-2">
            <div className="flex-1">
              <InputWithIcon
                id="address"
                icon={<MapPin className="w-5 h-5" />}
                placeholder="주소를 검색하세요"
                readOnly
                {...register('address')}
              />
            </div>
            <button
              type="button"
              onClick={handleAddressSearch}
              className="px-4 py-3 bg-btn-focus text-btn-focus-text rounded-2xl text-sm font-bold whitespace-nowrap hover:opacity-90 transition-all cursor-pointer"
            >
              주소 검색
            </button>
          </div>
          <div className="h-5 mt-1">
            {errors.address && (
              <p className="text-danger text-sm" role="alert">
                {errors.address.message}
              </p>
            )}
          </div>
        </Field>

        <BusinessFileUpload
          businessFile={businessFile}
          onChange={setBusinessFile}
        />

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
          {isUploading
            ? '파일 업로드 중...'
            : isLoading
              ? '가입 중...'
              : '가입하기'}
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
    </>
  );
}
