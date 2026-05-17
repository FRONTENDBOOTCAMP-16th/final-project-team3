import type { Metadata } from 'next';

import AdminUsersClient from '@/components/admin/users/AdminUsersClient';
import { ADMIN_USER_FILTERS } from '@/components/admin/users/constants';
import type {
  DojangQueryRow,
  ProfileQueryRow,
} from '@/components/admin/users/types';
import { mapProfilesToAdminUserRows } from '@/components/admin/users/utils';
import { getAdminPageMetadata } from '@/constants/adminMeta';
import {
  ADMIN_TABLE_PAGE_SIZE,
  buildAdminPaginationRange,
  parseAdminTableServerQuery,
  type AdminTableRouteSearchParams,
} from '@/lib/adminTableServerPagination';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = getAdminPageMetadata('users');

type AdminUsersPageSearchParams = Promise<
  AdminTableRouteSearchParams & {
    status?: string | string[] | undefined;
  }
>;

const DOJANG_ROLE_VALUES = ['manager', 'dojang', 'pending'] as const;

async function getAdminUsers(searchParams: Awaited<AdminUsersPageSearchParams>) {
  const supabase = await createSupabaseServerClient();
  const { requestedPage, activeFilter, normalizedSearchQuery } =
    parseAdminTableServerQuery({
      searchParams,
      filterParamName: 'status',
      validFilters: ADMIN_USER_FILTERS.map((filter) => filter.value),
      defaultFilter: 'all',
    });

  let profilesCountQuery = supabase.from('profiles').select('id', {
    count: 'exact',
    head: true,
  });

  let profilesDataQuery = supabase
    .from('profiles')
    .select(
      `
        created_at,
        account_status,
        avatar_url,
        belt_level,
        bio,
        email_value,
        id,
        name,
        nickname,
        role
      `,
    )
    .order('created_at', { ascending: false });

  if (activeFilter === '관리자') {
    profilesCountQuery = profilesCountQuery.eq('role', 'admin');
    profilesDataQuery = profilesDataQuery.eq('role', 'admin');
  }

  if (activeFilter === '도장') {
    profilesCountQuery = profilesCountQuery.in('role', [...DOJANG_ROLE_VALUES]);
    profilesDataQuery = profilesDataQuery.in('role', [...DOJANG_ROLE_VALUES]);
  }

  if (activeFilter === '일반') {
    profilesCountQuery = profilesCountQuery.eq('role', 'user');
    profilesDataQuery = profilesDataQuery.eq('role', 'user');
  }

  if (normalizedSearchQuery.length > 0) {
    const userSearchFilter = [
      `nickname.ilike.%${normalizedSearchQuery}%`,
      `name.ilike.%${normalizedSearchQuery}%`,
      `email_value.ilike.%${normalizedSearchQuery}%`,
    ].join(',');

    profilesCountQuery = profilesCountQuery.or(userSearchFilter);
    profilesDataQuery = profilesDataQuery.or(userSearchFilter);
  }

  const { count, error: profilesCountError } = await profilesCountQuery;

  if (profilesCountError) {
    throw new Error(profilesCountError.message);
  }

  const totalCount = count ?? 0;
  const { from, to, pageSize } = buildAdminPaginationRange({
    requestedPage,
    totalCount,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
  });

  const profilesResult = await profilesDataQuery.range(from, to);

  if (profilesResult.error) {
    throw new Error(profilesResult.error.message);
  }

  const profiles = (profilesResult.data ?? []) as ProfileQueryRow[];
  const profileIds = profiles.map((profile) => profile.id);

  const dojangsResult =
    profileIds.length > 0
      ? await supabase.from('dojang').select(
          `
        id,
        profile_id,
        business_number,
        representative,
        phone_value,
        address,
        business_file_url,
        dojang_status,
        created_at,
        updated_at
      `,
        ).in('profile_id', profileIds)
      : { data: [] as DojangQueryRow[], error: null };

  if (dojangsResult.error) {
    throw new Error(dojangsResult.error.message);
  }

  return {
    rows: mapProfilesToAdminUserRows(
      profiles,
      (dojangsResult.data ?? []) as DojangQueryRow[],
    ),
    totalCount,
    pageSize,
  };
}

interface AdminUsersPageProps {
  searchParams: AdminUsersPageSearchParams;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const resolvedSearchParams = await searchParams;
  const { rows, totalCount, pageSize } = await getAdminUsers(
    resolvedSearchParams,
  );

  return (
    <AdminUsersClient
      data={rows}
      totalCount={totalCount}
      pageSize={pageSize}
    />
  );
}
