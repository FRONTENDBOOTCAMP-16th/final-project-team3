export type SupportSection = 'dojang' | 'reports';

export interface SupportSectionFilterOption {
  label: string;
  value: SupportSection;
}

export type RawDojangStatus = 'pending' | 'approved' | 'rejected' | string | null;

export type RawReportStatus =
  | 'pending'
  | 'resolved'
  | 'ignored'
  | string
  | null;

export type RawReportActionType =
  | 'none'
  | 'hide_post'
  | 'delete_post'
  | string
  | null;

export type AdminDojangVerificationStatus =
  | '검토중'
  | '승인완료'
  | '승인거부';

export type AdminReportProcessStatus = '처리중' | '처리완료' | '문제없음';

export type AdminReportActionResult =
  | '조치 없음'
  | '게시글 숨김'
  | '게시글 삭제';

export interface SupportProfileQueryRow {
  id: string;
  nickname: string | null;
  email_value: string | null;
}

export interface SupportPostQueryRow {
  id: string;
  title: string | null;
  status: string | null;
  deleted_at: string | null;
}

export interface SupportDojangQueryRow {
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

export interface SupportReportQueryRow {
  id: string;
  reporter_id: string | null;
  post_id: string | null;
  reason: string | null;
  created_at: string;
  reports_status: RawReportStatus;
  handled_at: string | null;
  action_type: RawReportActionType;
}

export interface AdminDojangVerificationRow {
  id: string;
  profile_id: string;
  dojang_name: string;
  representative: string;
  phone: string;
  email: string;
  address: string;
  requested_at: string;
  status: AdminDojangVerificationStatus;
  raw_status: RawDojangStatus;
  business_number: string;
  business_file_url: string | null;
  updated_at: string;
}

export interface AdminReportRow {
  id: string;
  post_id: string | null;
  post_title: string;
  reason: string;
  reporter: string;
  reported_at: string;
  process_status: AdminReportProcessStatus;
  action_result: AdminReportActionResult;
  handled_at: string;
  raw_status: RawReportStatus;
  raw_action_type: RawReportActionType;
  post_status: string | null;
  post_deleted_at: string | null;
}
