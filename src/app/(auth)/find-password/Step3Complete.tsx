'use client';

import { useRouter } from 'next/navigation';

interface Step3CompleteProps {
  onReset: () => void;
}

export default function Step3Complete({ onReset }: Step3CompleteProps) {
  const router = useRouter();

  const handleClick = () => {
    onReset();
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="text-center flex flex-col gap-2">
        <p className="text-lg font-bold text-text-primary">
          비밀번호가 재설정되었습니다.
        </p>
        <p className="text-sm text-text-secondary">
          새 비밀번호로 다시 로그인해주세요.
        </p>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="w-full bg-btn-focus text-btn-focus-text py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all text-center cursor-pointer"
      >
        로그인하러 가기
      </button>
    </div>
  );
}
