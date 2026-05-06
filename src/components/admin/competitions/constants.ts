import type { AdminBadgeVariant } from '@/components/admin/AdminBadge';

import type {
  AdminCompetitionFilterOption,
  AdminCompetitionStatus,
} from './types';

export const COMPETITION_DEADLINE_WARNING_DAYS = 7;
export const UNKNOWN_COMPETITION_LOCATION = '미정';

export const ADMIN_COMPETITION_FILTERS = [
  { label: '전체', value: 'all' },
  { label: '모집중', value: '모집중' },
  { label: '마감임박', value: '마감임박' },
  { label: '모집완료', value: '모집완료' },
] as const satisfies readonly AdminCompetitionFilterOption[];

export const COMPETITION_STATUS_BADGE_VARIANT_MAP: Record<
  AdminCompetitionStatus,
  AdminBadgeVariant
> = {
  모집중: 'green',
  마감임박: 'yellow',
  모집완료: 'red',
};
