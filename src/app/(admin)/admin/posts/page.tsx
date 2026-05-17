import type { Metadata } from 'next';

import AdminPostTableClient from '@/components/admin/posts/AdminPostsTableClient';
import {
  ADMIN_POST_FILTERS,
  CATEGORY_QUERY_VALUE_MAP,
} from '@/components/admin/posts/constants';
import type { PostQueryRow } from '@/components/admin/posts/types';
import { mapPostQueryRowsToAdminPostRows } from '@/components/admin/posts/utils';
import { getAdminPageMetadata } from '@/constants/adminMeta';
import {
  ADMIN_TABLE_PAGE_SIZE,
  buildAdminPaginationRange,
  parseAdminTableServerQuery,
  type AdminTableRouteSearchParams,
} from '@/lib/adminTableServerPagination';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = getAdminPageMetadata('posts');

type AdminPostsPageSearchParams = Promise<
  AdminTableRouteSearchParams & {
    category?: string | string[] | undefined;
    status?: string | string[] | undefined;
  }
>;

type AdminPostStatusFilterValue =
  | 'all'
  | 'published'
  | 'hidden'
  | 'deleted';

const ADMIN_POST_STATUS_FILTERS = [
  'all',
  'published',
  'hidden',
  'deleted',
] as const satisfies readonly AdminPostStatusFilterValue[];

async function getAdminPosts(searchParams: Awaited<AdminPostsPageSearchParams>) {
  const supabase = await createSupabaseServerClient();
  const { requestedPage, activeFilter: activeCategory, normalizedSearchQuery } =
    parseAdminTableServerQuery({
      searchParams,
      filterParamName: 'category',
      validFilters: ADMIN_POST_FILTERS.map((filter) => filter.value),
      defaultFilter: 'all',
    });
  const { activeFilter: activeStatus } = parseAdminTableServerQuery({
    searchParams,
    filterParamName: 'status',
    validFilters: ADMIN_POST_STATUS_FILTERS,
    defaultFilter: 'all',
  });

  let countQuery = supabase.from('posts').select('id', {
    count: 'exact',
    head: true,
  });

  let dataQuery = supabase
    .from('posts')
    .select(
      `
      id,
      category,
      title,
      status,
      deleted_at,
      report_count,
      created_at,
      profiles (
        nickname
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (activeCategory !== 'all') {
    const dbCategory = CATEGORY_QUERY_VALUE_MAP[activeCategory];

    countQuery = countQuery.eq('category', dbCategory);
    dataQuery = dataQuery.eq('category', dbCategory);
  }

  if (activeStatus === 'published') {
    countQuery = countQuery.eq('status', 'published').is('deleted_at', null);
    dataQuery = dataQuery.eq('status', 'published').is('deleted_at', null);
  }

  if (activeStatus === 'hidden') {
    countQuery = countQuery.eq('status', 'hidden').is('deleted_at', null);
    dataQuery = dataQuery.eq('status', 'hidden').is('deleted_at', null);
  }

  if (activeStatus === 'deleted') {
    countQuery = countQuery.not('deleted_at', 'is', null);
    dataQuery = dataQuery.not('deleted_at', 'is', null);
  }

  if (normalizedSearchQuery.length > 0) {
    countQuery = countQuery.ilike('title', `%${normalizedSearchQuery}%`);
    dataQuery = dataQuery.ilike('title', `%${normalizedSearchQuery}%`);
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
    rows: mapPostQueryRowsToAdminPostRows((data ?? []) as PostQueryRow[]),
    totalCount,
    pageSize,
  };
}

interface AdminPostPageProps {
  searchParams: AdminPostsPageSearchParams;
}

export default async function AdminPostPage({
  searchParams,
}: AdminPostPageProps) {
  const resolvedSearchParams = await searchParams;
  const { rows, totalCount, pageSize } = await getAdminPosts(
    resolvedSearchParams,
  );

  return (
    <AdminPostTableClient
      data={rows}
      totalCount={totalCount}
      pageSize={pageSize}
    />
  );
}
