import type { LucideIcon } from 'lucide-react';

export interface AdminDashboardData {
  generalUsersCount: number;
  dojangCount: number;
  postCount: number;
  todaySignupsCount: number;
  pendingDojangCount: number;
  pendingReportsCount: number;
}

export type AdminDashboardMetricKey = keyof AdminDashboardData;

export type DashboardCardTone = 'slate' | 'blue' | 'green' | 'amber' | 'red';

export interface DashboardMetricConfig {
  key: AdminDashboardMetricKey;
  label: string;
  suffix: string;
  icon: LucideIcon;
  tone: DashboardCardTone;
}
