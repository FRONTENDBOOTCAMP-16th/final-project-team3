'use client';

import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

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
        className="w-full bg-input-bg border-none rounded-2xl py-4 pr-4 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all appearance-none"
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
        <BeltSelect />
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
      {tab === 'general' ? <GeneralForm /> : <div />}
    </>
  );
}
