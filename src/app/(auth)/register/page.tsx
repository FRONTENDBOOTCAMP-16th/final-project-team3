'use client';

import { supabase } from '@/lib/supabase';
import Script from 'next/script';
import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Phone, MapPin, CreditCard } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  registerGeneral,
  registerDojang,
  uploadBusinessFile,
} from '@/services/authService';

// 일반 회원 zod 유효성 검사 스키마
const generalSchema = z
  .object({
    name: z.string().optional(),
    nickname: z
      .string()
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(10, '닉네임은 10자 이하여야 합니다.'),
    email: z.string().email('올바른 이메일 형식으로 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
    passwordCheck: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    belt: z.string().min(1, '벨트를 선택해주세요.'),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

// 도장 회원 zod 유효성 검사 스키마 추가
const dojangSchema = z
  .object({
    name: z.string().optional(),
    nickname: z
      .string()
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(10, '닉네임은 10자 이하여야 합니다.'),
    email: z.string().email('올바른 이메일 형식으로 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
    passwordCheck: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    belt: z.string().min(1, '벨트를 선택해주세요.'),
    licenseNumber: z.string().min(1, '사업자등록번호를 입력해주세요.'),
    gymName: z.string().min(1, '기업명(도장명)을 입력해주세요.'),
    ownerName: z.string().min(1, '대표자명을 입력해주세요.'),
    phone: z.string().min(1, '연락처를 입력해주세요.'),
    address: z.string().min(1, '주소를 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

// 벨트 종류
const BELTS = [
  { value: 'white', label: 'White  (입문자)', color: '#e8e8e8' },
  { value: 'blue', label: 'Blue   (파란띠)', color: '#2e6fdb' },
  { value: 'purple', label: 'Purple (보라띠)', color: '#7c4ddb' },
  { value: 'brown', label: 'Brown  (갈색띠)', color: '#8b5a2b' },
  { value: 'black', label: 'Black  (검은띠)', color: '#1a1a1a' },
];

const BeltSelect = forwardRef<
  HTMLSelectElement,
  { id: string } & React.SelectHTMLAttributes<HTMLSelectElement>
>(({ id, ...rest }, ref) => {
  const [belt, setBelt] = useState('');
  const selectedColor = BELTS.find((b) => b.value === belt)?.color;

  return (
    <div className="relative">
      {selectedColor && (
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{ backgroundColor: selectedColor }}
        />
      )}
      <select
        id={id}
        ref={ref}
        {...rest}
        value={belt}
        onChange={(e) => setBelt(e.target.value)}
        className="w-full bg-input-bg border-none rounded-2xl py-4 pr-4 text-base text-text-secondary focus:ring-2 focus:ring-btn-focus outline-none transition-all appearance-none"
        style={{ paddingLeft: selectedColor ? '36px' : '16px' }}
      >
        <option value="">벨트를 선택하세요</option>
        {BELTS.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </select>
    </div>
  );
});
BeltSelect.displayName = 'BeltSelect';

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-text-primary mb-2"
      >
        {label}
      </label>
      {children}
      {/* 빈 p 태그 제거! 에러는 GeneralForm에서 직접 표시 */}
    </div>
  );
}

const InputWithIcon = forwardRef<
  HTMLInputElement,
  {
    id: string;
    icon: React.ReactNode;
    type?: string;
    placeholder: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ id, icon, type = 'text', placeholder, ...rest }, ref) => {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary flex items-center justify-center">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...rest}
        className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
      />
    </div>
  );
});
InputWithIcon.displayName = 'InputWithIcon';

// 일반 회원가입 폼
// react-hook-form + zod 유효성 검사 연결
// onSubmit → supabase API 연동 완료
type GeneralFormType = z.infer<typeof generalSchema>;

function GeneralForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');

  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    getValues,
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
  const handleCheckNickname = async () => {
    const nickname = getValues('nickname');
    if (!nickname || nickname.length < 2) return;

    setNicknameStatus('checking');

    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle();

    setNicknameStatus(data ? 'taken' : 'available');
  };
  const onSubmit = async (data: GeneralFormType) => {
    if (nicknameStatus !== 'available') {
      setServerError('닉네임 중복확인을 해주세요.');
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
      router.push('/login');
    } catch (e) {
      console.error(e);
      setServerError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        <p className="text-danger text-sm mt-1 h-5">
          {errors.name?.message ?? ''}
        </p>
      </Field>
      {/* 닉네임 */}
      <Field label="닉네임" htmlFor="nickname">
        <div className="flex gap-2">
          <div className="flex-1">
            <InputWithIcon
              id="nickname"
              icon={<User className="w-5 h-5" />}
              placeholder="닉네임을 입력하세요 (2~10자)"
              {...register('nickname', {
                onChange: () => setNicknameStatus('idle'),
              })}
            />
          </div>
          <button
            type="button"
            onClick={handleCheckNickname}
            disabled={nicknameStatus === 'checking'}
            className="px-4 py-3 bg-btn-focus text-btn-focus-text rounded-2xl text-sm font-bold whitespace-nowrap hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
          >
            {nicknameStatus === 'checking' ? '확인 중...' : '중복확인'}
          </button>
        </div>
        <p className="text-sm mt-1 h-5">
          {errors.nickname ? (
            <span className="text-danger">{errors.nickname.message}</span>
          ) : nicknameStatus === 'available' ? (
            <span className="text-green-500">사용 가능한 닉네임입니다!</span>
          ) : nicknameStatus === 'taken' ? (
            <span className="text-danger">이미 사용 중인 닉네임입니다.</span>
          ) : null}
        </p>
      </Field>
      <Field label="이메일" htmlFor="email">
        <InputWithIcon
          id="email"
          icon={<Mail className="w-5 h-5" />}
          type="email"
          placeholder="이메일을 입력하세요"
          {...register('email')}
        />
        <p className="text-danger text-sm mt-1 h-5">
          {errors.email?.message ?? ''}
        </p>
      </Field>
      <Field label="비밀번호" htmlFor="password">
        <InputWithIcon
          id="password"
          icon={<Lock className="w-5 h-5" />}
          type="password"
          placeholder="비밀번호를 입력하세요"
          {...register('password')}
        />
        <p className="text-danger text-sm mt-1 h-5">
          {errors.password?.message ?? ''}
        </p>
      </Field>
      <Field label="비밀번호 확인" htmlFor="passwordCheck">
        <InputWithIcon
          id="passwordCheck"
          icon={<Lock className="w-5 h-5" />}
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          {...register('passwordCheck')}
        />

        <p className="text-danger text-sm mt-1 h-5">
          {errors.passwordCheck?.message ?? ''}
        </p>
      </Field>
      <Field label="벨트" htmlFor="belt">
        <BeltSelect id="belt" {...register('belt')} />

        <p className="text-danger text-sm mt-1 h-5">
          {errors.belt?.message ?? ''}
        </p>
      </Field>

      {/* 서버 에러 메시지 */}
      {serverError && (
        <p className="text-danger text-sm text-center">{serverError}</p>
      )}
      {/* 로딩 중일 때 버튼 비활성화 */}
      <button
        type="submit"
        disabled={isLoading || nicknameStatus !== 'available'}
        className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
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

// 도장 회원가입 폼
// react-hook-form + zod 유효성 검사 연결
// onSubmit → supabase API 연동 완료
type DojangFormType = z.infer<typeof dojangSchema>;

function DojangForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');
  const [businessFile, setBusinessFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
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
      gymName: '',
      ownerName: '',
      phone: '',
      address: '',
    },
  });
  const handleCheckNickname = async () => {
    const nickname = getValues('nickname');
    if (!nickname || nickname.length < 2) return;

    setNicknameStatus('checking');

    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle();

    setNicknameStatus(data ? 'taken' : 'available');
  };
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: { address: string }) => {
        setValue('address', data.address, { shouldValidate: true });
      },
    }).open();
  };

  const onSubmit = async (data: DojangFormType) => {
    if (nicknameStatus !== 'available') {
      setServerError('닉네임 중복확인을 해주세요.');
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
        gymName: data.gymName,
        ownerName: data.ownerName,
        phone: data.phone,
        address: data.address,
        businessFileUrl,
      });
      router.push('/login');
    } catch (e) {
      console.error(e);
      setServerError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        <Field label="이름" htmlFor="dojang-name">
          <InputWithIcon
            id="dojang-name"
            icon={<User className="w-5 h-5" />}
            placeholder="이름을 입력하세요"
            {...register('name')}
          />
          <p className="text-danger text-sm mt-1 h-5">
            {errors.name?.message ?? ''}
          </p>
        </Field>
        {/* 닉네임 */}
        <Field label="닉네임" htmlFor="dojang-nickname">
          <div className="flex gap-2">
            <div className="flex-1">
              <InputWithIcon
                id="dojang-nickname"
                icon={<User className="w-5 h-5" />}
                placeholder="닉네임을 입력하세요 (2~10자)"
                {...register('nickname', {
                  onChange: () => setNicknameStatus('idle'),
                })}
              />
            </div>
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={nicknameStatus === 'checking'}
              className="px-4 py-3 bg-btn-focus text-btn-focus-text rounded-2xl text-sm font-bold whitespace-nowrap hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            >
              {nicknameStatus === 'checking' ? '확인 중...' : '중복확인'}
            </button>
          </div>
          <p className="text-sm mt-1 h-5">
            {errors.nickname ? (
              <span className="text-danger">{errors.nickname.message}</span>
            ) : nicknameStatus === 'available' ? (
              <span className="text-green-500">사용 가능한 닉네임입니다!</span>
            ) : nicknameStatus === 'taken' ? (
              <span className="text-danger">이미 사용 중인 닉네임입니다.</span>
            ) : null}
          </p>
        </Field>
        <Field label="이메일" htmlFor="dojang-email">
          <InputWithIcon
            id="dojang-email"
            icon={<Mail className="w-5 h-5" />}
            type="email"
            placeholder="이메일을 입력하세요"
            {...register('email')}
          />
          <p className="text-danger text-sm mt-1 h-5">
            {errors.email?.message ?? ''}
          </p>
        </Field>
        <Field label="비밀번호" htmlFor="dojang-password">
          <InputWithIcon
            id="dojang-password"
            icon={<Lock className="w-5 h-5" />}
            type="password"
            placeholder="비밀번호를 입력하세요"
            {...register('password')}
          />
          <p className="text-danger text-sm mt-1 h-5">
            {errors.password?.message ?? ''}
          </p>
        </Field>
        <Field label="비밀번호 확인" htmlFor="dojang-passwordConfirm">
          <InputWithIcon
            id="dojang-passwordConfirm"
            icon={<Lock className="w-5 h-5" />}
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            {...register('passwordCheck')}
          />
          <p className="text-danger text-sm mt-1 h-5">
            {errors.passwordCheck?.message ?? ''}
          </p>
        </Field>
        <Field label="벨트" htmlFor="dojang-belt">
          <BeltSelect id="dojang-belt" {...register('belt')} />
          <p className="text-danger text-sm mt-1 h-5">
            {errors.belt?.message ?? ''}
          </p>
        </Field>
        <Field label="사업자등록번호" htmlFor="licenseNumber">
          <InputWithIcon
            id="licenseNumber"
            icon={<CreditCard className="w-5 h-5" />}
            placeholder="사업자등록번호를 입력하세요"
            {...register('licenseNumber')}
          />
          <p className="text-danger text-sm mt-1 h-5">
            {errors.licenseNumber?.message ?? ''}
          </p>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="기업명(도장명)" htmlFor="gymName">
            <InputWithIcon
              id="gymName"
              icon={<CreditCard className="w-5 h-5" />}
              placeholder="도장명"
              {...register('gymName')}
            />
            <p className="text-danger text-sm mt-1 h-5">
              {errors.gymName?.message ?? ''}
            </p>
          </Field>
          <Field label="대표자명" htmlFor="ownerName">
            <InputWithIcon
              id="ownerName"
              icon={<User className="w-5 h-5" />}
              placeholder="대표자명"
              {...register('ownerName')}
            />
            <p className="text-danger text-sm mt-1 h-5">
              {errors.ownerName?.message ?? ''}
            </p>
          </Field>
        </div>
        <Field label="연락처" htmlFor="phone">
          <InputWithIcon
            id="phone"
            icon={<Phone className="w-5 h-5" />}
            type="tel"
            placeholder="010-0000-0000"
            {...register('phone')}
          />
          <p className="text-danger text-sm mt-1 h-5">
            {errors.phone?.message ?? ''}
          </p>
        </Field>
        <Field label="주소" htmlFor="address">
          <div className="flex gap-2">
            <div className="flex-1" onClick={handleAddressSearch}>
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
          <p className="text-danger text-sm mt-1 h-5">
            {errors.address?.message ?? ''}
          </p>
        </Field>

        {/* 파일 업로드 */}
        <div>
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            사업자등록증 첨부 (이미지/PDF)
          </label>
          <div
            role="button"
            tabIndex={0}
            onClick={() => document.getElementById('resume')?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.getElementById('resume')?.click();
              }
            }}
            className={`flex flex-col items-center justify-center rounded-2xl py-6 cursor-pointer hover:opacity-80 transition-all border-2 border-dashed ${
              businessFile
                ? 'bg-green-50 border-green-400'
                : 'bg-input-bg border-transparent'
            }`}
          >
            {businessFile ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-green-500 mb-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-green-600 font-medium">
                  {businessFile.name}
                </span>
                <span className="text-xs text-green-400 mt-1">
                  클릭하여 파일 변경
                </span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-text-secondary mb-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
                </svg>
                <span className="text-sm text-text-secondary">
                  클릭하여 파일 업로드
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  JPG, PNG, GIF, PDF (최대 10MB)
                </span>
              </>
            )}
            <input
              id="resume"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf"
              className="hidden"
              onChange={(e) => setBusinessFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {/* 서버 에러 메시지 */}
        {serverError && (
          <p className="text-danger text-sm text-center">{serverError}</p>
        )}
        {/* 로딩 중일 때 버튼 비활성화 */}
        <button
          type="submit"
          disabled={isLoading || nicknameStatus !== 'available'}
          className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
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

export default function RegisterPage() {
  const [tab, setTab] = useState<'general' | 'dojang'>('general');

  return (
    <>
      {/* 탭 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('general')}
          className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
            tab === 'general'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          일반 회원
        </button>
        <button
          onClick={() => setTab('dojang')}
          className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
            tab === 'dojang'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          도장 회원
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-text-primary mb-5 mt-10">
        회원가입
      </h2>
      {tab === 'general' ? <GeneralForm /> : <DojangForm />}
    </>
  );
}
