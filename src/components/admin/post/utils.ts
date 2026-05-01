import type { AdminBadgeVariant } from '@/components/admin/AdminBadge';

import { CATEGORY_LABEL_MAP, UNKNOWN_POST_AUTHOR } from './constants';
import type { AdminPostFilterValue, AdminPostRow, PostQueryRow } from './types';

export function getAuthorName(profiles: PostQueryRow['profiles']) {
  if (!profiles) return UNKNOWN_POST_AUTHOR;

  if (Array.isArray(profiles)) {
    return profiles[0]?.nickname ?? UNKNOWN_POST_AUTHOR;
  }

  return profiles.nickname ?? UNKNOWN_POST_AUTHOR;
}

export function formatPostDate(createdAt: string) {
  return createdAt.slice(0, 10);
}

export function mapPostQueryRowToAdminPostRow(
  post: PostQueryRow,
): AdminPostRow {
  return {
    id: post.id,
    category: CATEGORY_LABEL_MAP[post.category],
    title: post.title,
    author: getAuthorName(post.profiles),
    status: post.status,
    deleted_at: post.deleted_at,
    view_count: post.view_count ?? 0,
    report_count: post.report_count ?? 0,
    created_at: formatPostDate(post.created_at),
  };
}

export function mapPostQueryRowsToAdminPostRows(posts: PostQueryRow[]) {
  return posts.map(mapPostQueryRowToAdminPostRow);
}

export function getPostStatusBadge(row: AdminPostRow): {
  label: string;
  variant: AdminBadgeVariant;
} {
  if (row.deleted_at) {
    return { label: '삭제', variant: 'red' as const };
  }

  if (row.status === 'hidden') {
    return { label: '숨김', variant: 'yellow' as const };
  }

  return { label: '게시중', variant: 'green' as const };
}

export function matchesPostFilter(
  post: AdminPostRow,
  activeFilter: AdminPostFilterValue,
) {
  if (activeFilter === 'all') return true;

  return post.category === activeFilter;
}

export function filterAdminPosts(
  posts: AdminPostRow[],
  activeFilter: AdminPostFilterValue,
  searchQuery: string,
) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return posts.filter((post) => {
    const isFilterMatched = matchesPostFilter(post, activeFilter);

    const isSearchMatched =
      normalizedSearchQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedSearchQuery) ||
      post.author.toLowerCase().includes(normalizedSearchQuery);

    return isFilterMatched && isSearchMatched;
  });
}
