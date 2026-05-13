import type { AdminBadgeVariant } from '@/components/admin/AdminBadge';

import type {
  AdminDojangVerificationStatus,
  AdminReportActionResult,
  AdminReportPostStatus,
  AdminReportProcessStatus,
  SupportSectionFilterOption,
} from './types';

export const SUPPORT_SECTION_FILTERS = [
  { label: '도장 인증', value: 'dojang' },
  { label: '신고 내역', value: 'reports' },
] as const satisfies readonly SupportSectionFilterOption[];

export const UNKNOWN_DOJANG_NAME = '알 수 없는 도장';
export const UNKNOWN_EMAIL = '-';
export const UNKNOWN_TEXT = '-';
export const UNKNOWN_POST_TITLE = '알 수 없는 게시글';
export const UNKNOWN_REPORTER = '알 수 없음';
export const UNKNOWN_REPORT_REASON = '사유 없음';

export const DOJANG_STATUS_BADGE_VARIANT_MAP: Record<
  AdminDojangVerificationStatus,
  AdminBadgeVariant
> = {
  검토중: 'yellow',
  승인완료: 'green',
  승인거부: 'red',
};

export const REPORT_STATUS_BADGE_VARIANT_MAP: Record<
  AdminReportProcessStatus,
  AdminBadgeVariant
> = {
  처리중: 'yellow',
  처리완료: 'green',
  문제없음: 'gray',
};

export const REPORT_ACTION_BADGE_VARIANT_MAP: Record<
  AdminReportActionResult,
  AdminBadgeVariant
> = {
  '조치 없음': 'gray',
  '게시글 숨김': 'blue',
  '게시글 삭제': 'red',
  '-': 'gray',
};

export const REPORT_POST_STATUS_BADGE_VARIANT_MAP: Record<
  AdminReportPostStatus,
  AdminBadgeVariant
> = {
  게시중: 'green',
  숨김: 'yellow',
  삭제: 'red',
};
