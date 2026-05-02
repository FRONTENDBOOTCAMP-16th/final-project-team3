'use client';

import { useMemo, useState } from 'react';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminDataTable, {
  type AdminTableColumn,
} from '@/components/admin/AdminDataTable';
import AdminPostActions from '@/components/admin/AdminPostActions';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import {
  ADMIN_POST_FILTERS,
  CATEGORY_BADGE_VARIANT_MAP,
} from '@/components/admin/post/constants';
import type {
  AdminPostFilterValue,
  AdminPostRow,
} from '@/components/admin/post/types';
import {
  filterAdminPosts,
  getPostStatusBadge,
} from '@/components/admin/post/utils';

interface AdminPostTableClientProps {
  data: AdminPostRow[];
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
  { key: 'view_count', header: '조회수', width: '10%', align: 'center'},
  { key: 'report_count', header: '신고수', width: '8%', align: 'center'},
  { key: 'created_at', header: '작성일', width: '10%', align: 'center'},
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
}: AdminPostTableClientProps) {
  const [activeFilter, setActiveFilter] = useState<AdminPostFilterValue>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return filterAdminPosts(data, activeFilter, searchQuery);
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

      <AdminDataTable
        columns={POST_COLUMNS}
        data={filteredData}
        getRowKey={(row) => row.id}
      />
    </>
  );
}
