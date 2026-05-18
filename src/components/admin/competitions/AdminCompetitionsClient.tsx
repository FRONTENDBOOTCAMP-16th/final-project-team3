'use client';

import AdminBadge from '@/components/admin/AdminBadge';
import AdminDataTable, {
  type AdminTableColumn,
} from '@/components/admin/AdminDataTable';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import AdminCompetitionPostAction from '@/components/admin/competitions/AdminCompetitionPostAction';
import {
  ADMIN_COMPETITION_FILTERS,
  COMPETITION_PUBLISH_STATUS_BADGE_VARIANT_MAP,
  COMPETITION_STATUS_BADGE_VARIANT_MAP,
} from '@/components/admin/competitions/constants';
import type {
  AdminCompetitionFilterValue,
  AdminCompetitionRow,
} from '@/components/admin/competitions/types';
import { useAdminTableQueryState } from '@/hooks/useAdminTableQueryState';
import { ADMIN_TABLE_PAGE_SIZE } from '@/lib/adminTableServerPagination';

interface AdminCompetitionsClientProps {
  data: AdminCompetitionRow[];
  totalCount: number;
  pageSize?: number;
}

const COMPETITION_COLUMNS: AdminTableColumn<AdminCompetitionRow>[] = [
  { key: 'name', header: '대회 제목', width: '28%', align: 'left' },
  { key: 'location', header: '장소', width: '16%', align: 'left' },
  {
    key: 'status',
    header: '상태',
    width: '10%',
    align: 'center',
    render: (row) =>
      row.publish_status === '삭제' ? (
        <span className="text-sm text-zinc-400">-</span>
      ) : (
        <AdminBadge
          label={row.status}
          variant={COMPETITION_STATUS_BADGE_VARIANT_MAP[row.status]}
        />
      ),
  },
  {
    key: 'publish_status',
    header: '게시 상태',
    width: '10%',
    align: 'center',
    render: (row) => (
      <AdminBadge
        label={row.publish_status}
        variant={
          COMPETITION_PUBLISH_STATUS_BADGE_VARIANT_MAP[row.publish_status]
        }
      />
    ),
  },
  { key: 'event_date', header: '이벤트날짜', width: '10%', align: 'center' },
  {
    key: 'apply_deadline',
    header: '마감일',
    width: '10%',
    align: 'center',
  },
  { key: 'created_at', header: '생성일', width: '10%', align: 'center' },
  {
    key: 'id',
    header: '게시글',
    width: '6%',
    align: 'center',
    render: (row) => (
      <AdminCompetitionPostAction
        id={row.id}
        name={row.name}
        publishStatus={row.publish_status}
      />
    ),
  },
];

export default function AdminCompetitionsClient({
  data,
  totalCount,
  pageSize = ADMIN_TABLE_PAGE_SIZE,
}: AdminCompetitionsClientProps) {
  const {
    activeFilter,
    currentPage,
    searchQuery,
    setFilter,
    setPage,
    setSearchQuery,
    commitSearch,
  } = useAdminTableQueryState<AdminCompetitionFilterValue>({
    filterParamName: 'status',
    defaultFilter: 'all',
    validFilters: ADMIN_COMPETITION_FILTERS.map((filter) => filter.value),
  });

  return (
    <>
      <AdminTableToolbar
        filters={ADMIN_COMPETITION_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={commitSearch}
        searchPlaceholder="대회 제목 검색..."
        searchAriaLabel="대회 제목 검색"
      />

      <AdminDataTable
        caption="관리자 대회 일정 관리 목록"
        columns={COMPETITION_COLUMNS}
        currentPage={currentPage}
        data={data}
        emptyMessage="등록된 대회가 없습니다."
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
