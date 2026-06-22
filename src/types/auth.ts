import type { AppRole, BeltLevel } from './user';

export interface SignInForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  role: AppRole;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  belt_level: BeltLevel;
  business_number?: string;
  representative?: string;
  contact?: string;
  address?: string;
  business_file?: File;
}
