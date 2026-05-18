import type { AdminDashboardData } from '@/components/admin/dashboard/types';
import { DOJANG_ROLE_VALUES } from '@/components/admin/users/constants';
import { createSupabaseServerClient } from './supabase/server';

function getTodayStartIso() {
  const seoulDateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year =
    seoulDateParts.find((part) => part.type === 'year')?.value ?? '1970';
  const month =
    seoulDateParts.find((part) => part.type === 'month')?.value ?? '01';
  const day =
    seoulDateParts.find((part) => part.type === 'day')?.value ?? '01';

  return new Date(`${year}-${month}-${day}T00:00:00+09:00`).toISOString();
}

function normalizeCount(count: number | null) {
  return count ?? 0;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = await createSupabaseServerClient();

  const todayStartIso = getTodayStartIso();

  const [
    generalUsersResult,
    dojangResult,
    postsResult,
    todaySignupsResult,
    pendingDojangsResult,
    pendingReportsResult,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'user'),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .in('role', [...DOJANG_ROLE_VALUES]),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStartIso),
    supabase
      .from('dojang')
      .select('id', { count: 'exact', head: true })
      .eq('dojang_status', 'pending'),
    supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('reports_status', 'pending'),
  ]);

  if (generalUsersResult.error) {
    throw new Error(generalUsersResult.error.message);
  }

  if (dojangResult.error) {
    throw new Error(dojangResult.error.message);
  }

  if (postsResult.error) {
    throw new Error(postsResult.error.message);
  }

  if (todaySignupsResult.error) {
    throw new Error(todaySignupsResult.error.message);
  }

  if (pendingDojangsResult.error) {
    throw new Error(pendingDojangsResult.error.message);
  }

  if (pendingReportsResult.error) {
    throw new Error(pendingReportsResult.error.message);
  }

  return {
    generalUsersCount: normalizeCount(generalUsersResult.count),
    dojangCount: normalizeCount(dojangResult.count),
    postCount: normalizeCount(postsResult.count),
    todaySignupsCount: normalizeCount(todaySignupsResult.count),
    pendingDojangCount: normalizeCount(pendingDojangsResult.count),
    pendingReportsCount: normalizeCount(pendingReportsResult.count),
  };
}
