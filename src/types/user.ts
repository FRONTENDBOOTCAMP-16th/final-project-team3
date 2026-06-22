import type { AppRole } from './role';

export type { AppRole };

export type BeltLevel = 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';

export interface Profile {
  id: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
  belt_level: string | null;
  role: AppRole;
  phone_value?: string;
  email_value?: string;
  created_at: string;
  name?: string;
  business_number?: string;
  representative?: string;
  contact?: string;
  address?: string;
  business_file_url?: string;
}

