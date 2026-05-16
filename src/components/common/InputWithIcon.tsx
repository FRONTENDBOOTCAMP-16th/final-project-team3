import { forwardRef } from 'react';

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

export default InputWithIcon;
