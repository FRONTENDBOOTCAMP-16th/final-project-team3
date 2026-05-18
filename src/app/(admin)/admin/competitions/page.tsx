import type { Metadata } from 'next';

import AdminCompetitionsClient from '@/components/admin/competitions/AdminCompetitionsClient';
import {
  ADMIN_COMPETITION_FILTERS,
  COMPETITION_DEADLINE_WARNING_DAYS,
} from '@/components/admin/competitions/constants';
import type { CompetitionQueryRow } from '@/components/admin/competitions/types';
import { mapCompetitionQueryRowsToAdminCompetitionRows } from '@/components/admin/competitions/utils';
import { getAdminPageMetadata } from '@/constants/adminMeta';
import {
  ADMIN_TABLE_PAGE_SIZE,
  buildAdminPaginationRange,
  parseAdminTableServerQuery,
  type AdminTableRouteSearchParams,
} from '@/lib/adminTableServerPagination';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = getAdminPageMetadata('competitions');

type AdminCompetitionsPageSearchParams = Promise<
  AdminTableRouteSearchParams & {
    status?: string | string[] | undefined;
  }
>;

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getCompetitionFilterDates() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const warningDeadline = new Date(today);
  warningDeadline.setDate(today.getDate() + COMPETITION_DEADLINE_WARNING_DAYS);

  return {
    today: formatDateOnly(today),
    warningDeadline: formatDateOnly(warningDeadline),
  };
}

async function getAdminCompetitions(
  searchParams: Awaited<AdminCompetitionsPageSearchParams>,
) {
  const supabase = await createSupabaseServerClient();
  const { requestedPage, activeFilter, normalizedSearchQuery } =
    parseAdminTableServerQuery({
      searchParams,
      filterParamName: 'status',
      validFilters: ADMIN_COMPETITION_FILTERS.map((filter) => filter.value),
      defaultFilter: 'all',
    });
  const { today, warningDeadline } = getCompetitionFilterDates();

  let countQuery = supabase.from('competition').select('id', {
    count: 'exact',
    head: true,
  });

  let dataQuery = supabase
    .from('competition')
    .select(
      `
      id,
      name,
      location,
      event_data,
      apply_deadline,
      created_at,
      deleted_at
    `,
    )
    .order('created_at', { ascending: false });

  if (activeFilter === '모집완료') {
    countQuery = countQuery.lt('apply_deadline', today);
    dataQuery = dataQuery.lt('apply_deadline', today);
  }

  if (activeFilter === '마감임박') {
    countQuery = countQuery
      .gte('apply_deadline', today)
      .lte('apply_deadline', warningDeadline);
    dataQuery = dataQuery
      .gte('apply_deadline', today)
      .lte('apply_deadline', warningDeadline);
  }

  if (activeFilter === '모집중') {
    countQuery = countQuery.gt('apply_deadline', warningDeadline);
    dataQuery = dataQuery.gt('apply_deadline', warningDeadline);
  }

  if (normalizedSearchQuery.length > 0) {
    countQuery = countQuery.ilike('name', `%${normalizedSearchQuery}%`);
    dataQuery = dataQuery.ilike('name', `%${normalizedSearchQuery}%`);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    throw new Error(countError.message);
  }

  const totalCount = count ?? 0;
  const { from, to, pageSize } = buildAdminPaginationRange({
    requestedPage,
    totalCount,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
  });

  const { data, error } = await dataQuery.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    rows: mapCompetitionQueryRowsToAdminCompetitionRows(
      (data ?? []) as CompetitionQueryRow[],
    ),
    totalCount,
    pageSize,
  };
}

interface AdminCompetitionsPageProps {
  searchParams: AdminCompetitionsPageSearchParams;
}

export default async function AdminCompetitionsPage({
  searchParams,
}: AdminCompetitionsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { rows, totalCount, pageSize } = await getAdminCompetitions(
    resolvedSearchParams,
  );

  return (
    <AdminCompetitionsClient
      data={rows}
      totalCount={totalCount}
      pageSize={pageSize}
    />
  );
}
