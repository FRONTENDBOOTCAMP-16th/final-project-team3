import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import type { AdminDashboardData } from '@/components/admin/dashboard/types';

function getTodayStartIso() {
  const todayStart = new Date();

  todayStart.setHours(0, 0, 0, 0);

  return todayStart.toISOString();
}

function normalizeCount(count: number | null) {
  return count ?? 0;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );

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
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'manager'),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStartIso),
    supabase
      .from('dojang')
      .select('*', { count: 'exact', head: true })
      .eq('dojang_status', 'pending'),
    supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
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
