import type { Role, BeltLevel } from './user';

export type SignInForm = {
  email: string;
  password: string;
};

export type SignUpForm = {
  role: Role;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  belt_level: BeltLevel;
  // 도장 회원 전용
  business_number?: string;
  representative?: string;
  contact?: string;
  address?: string;
  business_file?: File;
};
