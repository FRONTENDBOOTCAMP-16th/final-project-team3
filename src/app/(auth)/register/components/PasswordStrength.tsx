interface PasswordStrengthProps {
  password: string;
}

const conditions = [
  { label: '8자 이상', regex: /.{8,}/ },
  { label: '영문 포함', regex: /[a-zA-Z]/ },
  { label: '숫자 포함', regex: /[0-9]/ },
  { label: '특수문자 포함', regex: /[!@#$%^&*]/ },
];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return <div className="h-5 mt-1" />;

  return (
    <div className="flex gap-3 mt-2 flex-wrap">
      {conditions.map(({ label, regex }) => {
        const isValid = regex.test(password);
        return (
          <span
            key={label}
            className={`text-xs font-medium ${
              isValid ? 'text-green-500' : 'text-text-secondary'
            }`}
          >
            {isValid ? '✅' : '❌'} {label}
          </span>
        );
      })}
    </div>
  );
}
