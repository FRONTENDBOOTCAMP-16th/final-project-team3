import type { AdminBadgeVariant } from '@/components/admin/AdminBadge';

import type {
  AdminAccountStatus,
  AdminDojangApprovalStatus,
  AdminUserFilterOption,
  AdminUserType,
} from './types';

export const UNKNOWN_USER_NICKNAME = '알 수 없음';
export const UNKNOWN_USER_NAME = '-';
export const UNKNOWN_USER_EMAIL = '-';
export const DOJANG_ROLE_VALUES = ['manager'] as const;

export const ADMIN_USER_FILTERS = [
  { label: '전체', value: 'all' },
  { label: '일반', value: '일반' },
  { label: '도장', value: '도장' },
  { label: '관리자', value: '관리자' },
] as const satisfies readonly AdminUserFilterOption[];

export const USER_TYPE_BADGE_VARIANT_MAP: Record<
  AdminUserType,
  AdminBadgeVariant
> = {
  일반: 'gray',
  도장: 'blue',
  관리자: 'red',
};

export const ACCOUNT_STATUS_BADGE_VARIANT_MAP: Record<
  AdminAccountStatus,
  AdminBadgeVariant
> = {
  활성: 'green',
  비활성: 'red',
};

export const DOJANG_APPROVAL_BADGE_VARIANT_MAP: Record<
  AdminDojangApprovalStatus,
  AdminBadgeVariant
> = {
  승인대기: 'yellow',
  승인완료: 'green',
  승인거부: 'red',
};
