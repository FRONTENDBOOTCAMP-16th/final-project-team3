import { User } from 'lucide-react';
import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';
import InputWithIcon from '@/components/common/InputWithIcon';
import Field from '@/components/common/Field';
import { NicknameStatus } from '@/hooks/useNicknameCheck';

interface NicknameFieldProps<T extends FieldValues> {
  id: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  nicknameStatus: NicknameStatus;
}

export default function NicknameField<T extends FieldValues>({
  id,
  register,
  errors,
  nicknameStatus,
}: NicknameFieldProps<T>) {
  return (
    <Field label="닉네임" htmlFor={id}>
      <InputWithIcon
        id={id}
        icon={<User className="w-5 h-5" />}
        placeholder="닉네임을 입력하세요 (2~10자)"
        {...register('nickname' as Path<T>)}
      />
      <div className="h-5 mt-1">
        {errors.nickname ? (
          <p className="text-danger text-sm" role="alert">
            {errors.nickname.message as string}
          </p>
        ) : nicknameStatus === 'checking' ? (
          <p className="text-text-secondary text-sm">확인 중...</p>
        ) : nicknameStatus === 'available' ? (
          <p className="text-green-500 text-sm">사용 가능한 닉네임입니다!</p>
        ) : nicknameStatus === 'taken' ? (
          <p className="text-danger text-sm" role="alert">
            이미 사용 중인 닉네임입니다.
          </p>
        ) : null}
      </div>
    </Field>
  );
}
