export interface AdminFilterOption {
  label: string;
  value: string;
}

export const ADMIN_POST_FILTERS: AdminFilterOption[] = [
  { label: '전체', value: 'all' },
  { label: '일반', value: 'general' },
  { label: '도장', value: 'dojang' },
  { label: '대회', value: 'competition' },
];
