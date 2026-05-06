export type RawUserRole =
  | 'user'
  | 'manager'
  | 'dojang'
  | 'pending'
  | 'admin'
  | string
  | null;

export type RawAccountStatus =
  | 'active'
  | 'inactive'
  | 'suspended'
  | string
  | null;

export type RawDojangStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | string
  | null;

export type AdminUserType = '일반' | '도장' | '관리자';

export type AdminAccountStatus = '활성' | '비활성';

export type AdminDojangApprovalStatus =
  | '승인대기'
  | '승인완료'
  | '승인거부';

export type AdminUserFilterValue = 'all' | AdminUserType;

export interface AdminUserFilterOption {
  label: string;
  value: AdminUserFilterValue;
}

export interface ProfileQueryRow {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
  belt_level: string | null;
  created_at: string;
  role: RawUserRole;
  email_value: string | null;
  name: string | null;
  account_status: RawAccountStatus;
}

export interface DojangQueryRow {
  id: string;
  profile_id: string;
  business_number: string | null;
  representative: string | null;
  phone_value: string | null;
  address: string | null;
  business_file_url: string | null;
  dojang_status: RawDojangStatus;
  created_at: string;
  updated_at: string;
}

export interface AdminUserRow {
  id: string;
  avatar_url: string | null;
  nickname: string;
  name: string;
  email: string;
  user_type: AdminUserType;
  account_status: AdminAccountStatus;
  dojang_approval_status: AdminDojangApprovalStatus | null;
  joined_at: string;
  raw_role: RawUserRole;
  raw_account_status: RawAccountStatus;
  raw_dojang_status: RawDojangStatus;
  bio: string | null;
  belt_level: string | null;
  business_number: string | null;
  representative: string | null;
  phone_value: string | null;
  address: string | null;
  business_file_url: string | null;
}
