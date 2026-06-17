'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputWithIcon = forwardRef<
  HTMLInputElement,
  {
    id: string;
    icon: React.ReactNode;
    type?: string;
    placeholder: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ id, icon, type = 'text', placeholder, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary flex items-center justify-center">
        {icon}
      </span>
      <input
        id={id}
        type={inputType}
        placeholder={placeholder}
        ref={ref}
        {...rest}
        className="w-full bg-input-bg border-none rounded-2xl py-4 pl-12 pr-12 text-base text-input-text focus:ring-2 focus:ring-btn-focus outline-none transition-all"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
});
InputWithIcon.displayName = 'InputWithIcon';

export default InputWithIcon;
