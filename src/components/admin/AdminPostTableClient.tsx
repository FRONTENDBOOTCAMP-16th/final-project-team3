'use client';

import { useMemo, useState } from 'react';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPostActions from '@/components/admin/AdminPostActions';
import AdminBadge from '@/components/admin/AdminBadge';
import { ADMIN_POST_FILTERS } from '@/constants/adminPostFilters';

export type AdminPostStatus = 'published' | 'hidden';
export type AdminPostCategory = '일반' | '도장홍보' | '공지';
type BadgeVariant = 'gray' | 'blue' | 'red' | 'green' | 'yellow';

export interface AdminPostRow {
  id: string;
  category: AdminPostCategory;
  title: string;
  author: string;
  status: AdminPostStatus;
  deleted_at: string | null;
  view_count: number;
  report_count: number;
  created_at: string;
}

const categoryBadgeVariantMap: Record<AdminPostCategory, BadgeVariant> = {
  일반: 'gray',
  도장홍보: 'blue',
  공지: 'red',
};

function getPostStatusBadge(row: AdminPostRow): {
  label: string;
  variant: BadgeVariant;
} {
  if (row.deleted_at) return { label: '삭제', variant: 'red' };
  if (row.status === 'hidden') return { label: '숨김', variant: 'yellow' };
  return { label: '게시중', variant: 'green' };
}

function matchesFilter(post: AdminPostRow, activeFilter: string) {
  if (activeFilter === 'all') return true;

  return post.category === activeFilter;
}

interface AdminPostTableClientProps {
  data: AdminPostRow[];
}

export default function AdminPostTableClient({
  data,
}: AdminPostTableClientProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const postColumns = [
    { key: 'title', header: '제목' },
    { key: 'author', header: '작성자' },
    {
      key: 'category',
      header: '구분',
      render: (row) => (
        <AdminBadge
          label={row.category}
          variant={categoryBadgeVariantMap[row.category]}
        />
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => {
        const { label, variant } = getPostStatusBadge(row);

        return <AdminBadge label={label} variant={variant} />;
      },
    },
    { key: 'view_count', header: '조회수' },
    { key: 'report_count', header: '신고수' },
    { key: 'created_at', header: '작성일' },
    {
      key: 'id',
      header: '관리',
      render: (row) => (
        <AdminPostActions
          id={row.id}
          title={row.title}
          status={row.status}
          deleted_at={row.deleted_at}
        />
      ),
    },
  ] satisfies {
    key: keyof AdminPostRow;
    header: string;
    render?: (row: AdminPostRow) => React.ReactNode;
  }[];

  const filteredData = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return data.filter((post) => {
      const isFilterMatched = matchesFilter(post, activeFilter);

      const isSearchMatched =
        normalizedSearchQuery.length === 0 ||
        post.title.toLowerCase().includes(normalizedSearchQuery) ||
        post.author.toLowerCase().includes(normalizedSearchQuery);

      return isFilterMatched && isSearchMatched;
    });
  }, [data, activeFilter, searchQuery]);

  return (
    <>
      <AdminTableToolbar
        filters={ADMIN_POST_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <AdminDataTable columns={postColumns} data={filteredData} />
    </>
  );
}