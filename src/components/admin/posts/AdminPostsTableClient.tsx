'use client';

import AdminBadge from '@/components/admin/AdminBadge';
import AdminDataTable, {
  type AdminTableColumn,
} from '@/components/admin/AdminDataTable';
import AdminPostActions from '@/components/admin/posts/AdminPostsActions';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import {
  ADMIN_POST_FILTERS,
  CATEGORY_BADGE_VARIANT_MAP,
} from '@/components/admin/posts/constants';
import type {
  AdminPostFilterValue,
  AdminPostRow,
} from '@/components/admin/posts/types';
import { useAdminTableQueryState } from '@/hooks/useAdminTableQueryState';
import { getPostStatusBadge } from '@/components/admin/posts/utils';
import { ADMIN_TABLE_PAGE_SIZE } from '@/lib/adminTableServerPagination';

interface AdminPostTableClientProps {
  data: AdminPostRow[];
  totalCount: number;
  pageSize?: number;
}

const POST_COLUMNS: AdminTableColumn<AdminPostRow>[] = [
  { key: 'title', header: '제목', width: '25%', align: 'left' },
  { key: 'author', header: '작성자', width: '13%', align: 'center' },
  {
    key: 'category',
    header: '구분',
    width: '7%',
    align: 'center',
    render: (row) => (
      <AdminBadge
        label={row.category}
        variant={CATEGORY_BADGE_VARIANT_MAP[row.category]}
      />
    ),
  },
  {
    key: 'status',
    header: '상태',
    width: '7%',
    align: 'center',
    render: (row) => {
      const { label, variant } = getPostStatusBadge(row);

      return <AdminBadge label={label} variant={variant} />;
    },
  },
  { key: 'report_count', header: '신고수', width: '8%', align: 'center' },
  { key: 'created_at', header: '작성일', width: '10%', align: 'center' },
  {
    key: 'id',
    header: '관리',
    width: '15%',
    align: 'center',
    render: (row) => (
      <AdminPostActions
        id={row.id}
        title={row.title}
        status={row.status}
        deleted_at={row.deleted_at}
      />
    ),
  },
];

export default function AdminPostTableClient({
  data,
  totalCount,
  pageSize = ADMIN_TABLE_PAGE_SIZE,
}: AdminPostTableClientProps) {
  const {
    activeFilter,
    currentPage,
    searchQuery,
    setFilter,
    setPage,
    setSearchQuery,
    commitSearch,
  } = useAdminTableQueryState<AdminPostFilterValue>({
    filterParamName: 'category',
    defaultFilter: 'all',
    validFilters: ADMIN_POST_FILTERS.map((filter) => filter.value),
  });

  return (
    <>
      <AdminTableToolbar
        filters={ADMIN_POST_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={commitSearch}
      />

      <AdminDataTable
        columns={POST_COLUMNS}
        data={data}
        emptyMessage="등록된 게시글이 없습니다."
        currentPage={currentPage}
        getRowKey={(row) => row.id}
        initialPageSize={pageSize}
        onPageChange={setPage}
        pageSizeOptions={[pageSize]}
        serverPagination
        totalItems={totalCount}
      />
    </>
  );
}
