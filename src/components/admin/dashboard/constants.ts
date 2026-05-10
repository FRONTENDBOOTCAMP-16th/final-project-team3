import {
  BellRing,
  FileText,
  ShieldAlert,
  Store,
  UserPlus,
  Users,
} from 'lucide-react';

import type { DashboardMetricConfig } from './types';

export const OVERVIEW_METRICS = [
  {
    key: 'generalUsersCount',
    label: '일반 유저 수',
    suffix: '명',
    icon: Users,
    tone: 'slate',
  },
  {
    key: 'dojangCount',
    label: '도장 수',
    suffix: '개',
    icon: Store,
    tone: 'blue',
  },
  {
    key: 'postCount',
    label: '게시글 수',
    suffix: '개',
    icon: FileText,
    tone: 'green',
  },
  {
    key: 'todaySignupsCount',
    label: '오늘 가입자',
    suffix: '명',
    icon: UserPlus,
    tone: 'amber',
  },
] as const satisfies readonly DashboardMetricConfig[];

export const ALERT_METRICS = [
  {
    key: 'pendingDojangCount',
    label: '승인 대기 도장',
    suffix: '건',
    icon: BellRing,
    tone: 'amber',
  },
  {
    key: 'pendingReportsCount',
    label: '미처리 신고',
    suffix: '건',
    icon: ShieldAlert,
    tone: 'red',
  },
] as const satisfies readonly DashboardMetricConfig[];
