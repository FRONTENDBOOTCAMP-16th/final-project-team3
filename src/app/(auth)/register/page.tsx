'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Phone, MapPin, CreditCard } from 'lucide-react';

// 벨트 종류
const BELTS = [
  { value: 'white', label: 'White  (입문자)', color: '#e8e8e8' },
  { value: 'yellow', label: 'Yellow (노란띠)', color: '#f5c842' },
  { value: 'green', label: 'Green  (초록띠)', color: '#3a9e4f' },
  { value: 'blue', label: 'Blue   (파란띠)', color: '#2e6fdb' },
  { value: 'purple', label: 'Purple (보라띠)', color: '#7c4ddb' },
  { value: 'brown', label: 'Brown  (갈색띠)', color: '#8b5a2b' },
  { value: 'red', label: 'Red    (빨간띠)', color: '#d63a2a' },
  { value: 'black', label: 'Black  (검은띠)', color: '#1a1a1a' },
];

function BeltSelect() {
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
        id="belt"
        value={belt}
        onChange={(e) => setBelt(e.target.value)}
        className="w-full bg-input-bg border-none rounded-2xl py-4 pr-4 text-base text-text-secondary  focus:ring-2 focus:ring-btn-focus outline-none transition-all appearance-none"
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
}

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
      <p className="text-danger text-sm mt-1 h-5" />
    </div>
  );
}

function InputWithIcon({
  id,
  icon,
  type = 'text',
  placeholder,
}: {
  id: string;
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary flex items-center justify-center">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
      />
    </div>
  );
}
// 일반 회원가입 폼
function GeneralForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        // 나중에 handleRegister() 연결할 거예요
      }}
    >
      <Field label="이름" htmlFor="name">
        <InputWithIcon
          id="name"
          icon={<User className="w-5 h-5" />}
          placeholder="이름을 입력하세요"
        />
      </Field>
      <Field label="이메일" htmlFor="email">
        <InputWithIcon
          id="email"
          icon={<Mail className="w-5 h-5" />}
          type="email"
          placeholder="이메일을 입력하세요"
        />
      </Field>
      <Field label="비밀번호" htmlFor="password">
        <InputWithIcon
          id="password"
          icon={<Lock className="w-5 h-5" />}
          type="password"
          placeholder="비밀번호를 입력하세요"
        />
      </Field>
      <Field label="비밀번호 확인" htmlFor="passwordCheck">
        <InputWithIcon
          id="passwordCheck"
          icon={<Lock className="w-5 h-5" />}
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
        />
      </Field>
      <Field label="벨트" htmlFor="belt">
        <BeltSelect id="belt" />
      </Field>

      <button
        type="submit"
        className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all"
      >
        가입하기
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
function DojangForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Field label="이름" htmlFor="dojang-name">
        <InputWithIcon
          id="dojang-name"
          icon={<User className="w-5 h-5" />}
          placeholder="이름을 입력하세요"
        />
      </Field>
      <Field label="이메일" htmlFor="dojang-email">
        <InputWithIcon
          id="dojang-email"
          icon={<Mail className="w-5 h-5" />}
          type="email"
          placeholder="이메일을 입력하세요"
        />
      </Field>
      <Field label="비밀번호" htmlFor="dojang-password">
        <InputWithIcon
          id="dojang-password"
          icon={<Lock className="w-5 h-5" />}
          type="password"
          placeholder="비밀번호를 입력하세요"
        />
      </Field>
      <Field label="비밀번호 확인" htmlFor="dojang-passwordConfirm">
        <InputWithIcon
          id="dojang-passwordConfirm"
          icon={<Lock className="w-5 h-5" />}
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
        />
      </Field>
      <Field label="벨트" htmlFor="belt" noError>
        <BeltSelect id="belt" />
      </Field>
      <Field label="사업자등록번호" htmlFor="licenseNumber">
        <InputWithIcon
          id="licenseNumber"
          icon={<CreditCard className="w-5 h-5" />}
          placeholder="사업자등록번호를 입력하세요"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="기업명(도장명)" htmlFor="gymName">
          <InputWithIcon
            id="gymName"
            icon={<CreditCard className="w-5 h-5" />}
            placeholder="도장명"
          />
        </Field>
        <Field label="대표자명" htmlFor="ownerName">
          <InputWithIcon
            id="ownerName"
            icon={<User className="w-5 h-5" />}
            placeholder="대표자명"
          />
        </Field>
      </div>
      <Field label="연락처" htmlFor="phone">
        <InputWithIcon
          id="phone"
          icon={<Phone className="w-5 h-5" />}
          type="tel"
          placeholder="010-0000-0000"
        />
      </Field>
      <Field label="주소" htmlFor="address">
        <InputWithIcon
          id="address"
          icon={<MapPin className="w-5 h-5" />}
          placeholder="주소를 입력하세요"
        />
      </Field>

      {/* 파일 업로드 */}
      <div>
        <label
          htmlFor="resume"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          사업자등록증 첨부 (이미지/PDF)
        </label>
        <label className="flex flex-col items-center justify-center bg-input-bg rounded-2xl py-6 cursor-pointer hover:opacity-80 transition-all">
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
          <input
            id="resume"
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.pdf"
            className="hidden"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all"
      >
        가입하기
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

export default function RegisterPage() {
  const [tab, setTab] = useState<'general' | 'dojang'>('general');

  return (
    <>
      {/* 탭 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('general')}
          className={`flex-1 pb-3 text-sm font-bold transition-all ${
            tab === 'general'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          일반 회원
        </button>
        <button
          onClick={() => setTab('dojang')}
          className={`flex-1 pb-3 text-sm font-bold transition-all ${
            tab === 'dojang'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          도장 회원
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-text-primary mb-15 mt-22">
        회원가입
      </h2>
      {tab === 'general' ? <GeneralForm /> : <DojangForm />}
    </>
  );
}
