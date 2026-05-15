import type { Metadata } from 'next';

import AdminPostTableClient from '@/components/admin/posts/AdminPostsTableClient';
import {
  ADMIN_POST_FILTERS,
  ADMIN_POSTS_PAGE_SIZE,
  CATEGORY_QUERY_VALUE_MAP,
} from '@/components/admin/posts/constants';
import type { PostQueryRow } from '@/components/admin/posts/types';
import type { AdminPostFilterValue } from '@/components/admin/posts/types';
import { mapPostQueryRowsToAdminPostRows } from '@/components/admin/posts/utils';
import { getAdminPageMetadata } from '@/constants/adminMeta';
import { parseEnumParam, parsePositiveIntParam } from '@/lib/urlSearchParams';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = getAdminPageMetadata('posts');

type AdminPostsPageSearchParams = Promise<{
  page?: string | string[] | undefined;
  search?: string | string[] | undefined;
  category?: string | string[] | undefined;
  status?: string | string[] | undefined;
}>;

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

function getSingleSearchParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

async function getAdminPosts(searchParams: Awaited<AdminPostsPageSearchParams>) {
  const supabase = await createSupabaseServerClient();
  const requestedPage = parsePositiveIntParam(
    getSingleSearchParam(searchParams.page),
    1,
  ).value;
  const activeCategory = parseEnumParam<AdminPostFilterValue>(
    getSingleSearchParam(searchParams.category),
    ADMIN_POST_FILTERS.map((filter) => filter.value),
    'all',
  );
  const activeStatus = parseEnumParam<AdminPostStatusFilterValue>(
    getSingleSearchParam(searchParams.status),
    ADMIN_POST_STATUS_FILTERS,
    'all',
  );
  const normalizedSearchQuery =
    getSingleSearchParam(searchParams.search)?.trim() ?? '';
  let authorIds: string[] = [];

  if (normalizedSearchQuery.length > 0) {
    const { data: matchingProfiles, error: authorSearchError } = await supabase
      .from('profiles')
      .select('id')
      .ilike('nickname', `%${normalizedSearchQuery}%`);

    if (authorSearchError) {
      throw new Error(authorSearchError.message);
    }

    authorIds = (matchingProfiles ?? []).map((profile) => profile.id);
  }

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
      view_count,
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
    const titleFilter = `title.ilike.%${normalizedSearchQuery}%`;

    if (authorIds.length > 0) {
      const authorFilter = `user_id.in.(${authorIds.join(',')})`;
      const searchFilter = `${titleFilter},${authorFilter}`;

      countQuery = countQuery.or(searchFilter);
      dataQuery = dataQuery.or(searchFilter);
    } else {
      countQuery = countQuery.ilike('title', `%${normalizedSearchQuery}%`);
      dataQuery = dataQuery.ilike('title', `%${normalizedSearchQuery}%`);
    }
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    throw new Error(countError.message);
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_POSTS_PAGE_SIZE));
  const currentPage =
    totalCount === 0 ? 1 : Math.min(requestedPage, totalPages);
  const from = (currentPage - 1) * ADMIN_POSTS_PAGE_SIZE;
  const to = from + ADMIN_POSTS_PAGE_SIZE - 1;

  const { data, error } = await dataQuery.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    rows: mapPostQueryRowsToAdminPostRows((data ?? []) as PostQueryRow[]),
    totalCount,
    pageSize: ADMIN_POSTS_PAGE_SIZE,
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
