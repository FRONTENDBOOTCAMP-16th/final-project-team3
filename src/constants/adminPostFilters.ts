export const ADMIN_POST_FILTERS = [
  { label: '전체', value: 'all' },
  { label: '일반', value: '일반' },
  { label: '도장홍보', value: '도장홍보' },
  { label: '공지', value: '공지' },
] as const;

export type AdminFilterOption = (typeof ADMIN_POST_FILTERS)[number];