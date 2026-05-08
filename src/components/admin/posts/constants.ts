import type { AdminBadgeVariant } from '@/components/admin/AdminBadge';

import type {
  AdminPostCategory,
  AdminPostFilterOption,
  DbPostCategory,
} from './types';

export const UNKNOWN_POST_AUTHOR = '알 수 없음';

export const ADMIN_POST_FILTERS = [
  { label: '전체', value: 'all' },
  { label: '일반', value: '일반' },
  { label: '도장홍보', value: '도장홍보' },
  { label: '공지', value: '공지' },
] as const satisfies readonly AdminPostFilterOption[];

export const CATEGORY_LABEL_MAP: Record<DbPostCategory, AdminPostCategory> = {
  personal: '일반',
  promo: '도장홍보',
  notice: '공지',
};

export const CATEGORY_BADGE_VARIANT_MAP: Record<
  AdminPostCategory,
  AdminBadgeVariant
> = {
  일반: 'gray',
  도장홍보: 'blue',
  공지: 'red',
};
