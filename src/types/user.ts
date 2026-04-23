export type Role = 'user' | 'dojang' | 'admin';

export type BeltLevel = 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';

export type Profile = {
  id: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
  belt_level: BeltLevel;
  role: Role;
  phone_value?: string;
  email_value?: string;
  created_at: string;
  // 도장 회원 추가 필드
  name?: string;
  business_number?: string;
  representative?: string;
  contact?: string;
  address?: string;
  business_file_url?: string;
};
