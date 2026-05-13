'use client';

import { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';

import AdminBadge from '@/components/admin/AdminBadge';
import AdminDataTable, {
  type AdminTableColumn,
} from '@/components/admin/AdminDataTable';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import {
  ADMIN_COMPETITION_FILTERS,
  COMPETITION_PUBLISH_STATUS_BADGE_VARIANT_MAP,
  COMPETITION_STATUS_BADGE_VARIANT_MAP,
} from '@/components/admin/competitions/constants';
import type {
  AdminCompetitionFilterValue,
  AdminCompetitionRow,
} from '@/components/admin/competitions/types';
import { filterAdminCompetitions } from '@/components/admin/competitions/utils';
import { ROUTES } from '@/constants/routes';

interface AdminCompetitionsClientProps {
  data: AdminCompetitionRow[];
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
    render: (row) =>
      row.publish_status === '삭제' ? (
        <span className="text-sm text-zinc-400">-</span>
      ) : (
        <a
          href={ROUTES.COMPETITIONS_DETAIL(row.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-zinc-500 transition-colors hover:text-black"
          title="대회 게시글 보기"
        >
          <FileText className="size-4" />
        </a>
      ),
  },
];

export default function AdminCompetitionsClient({
  data,
}: AdminCompetitionsClientProps) {
  const [activeFilter, setActiveFilter] =
    useState<AdminCompetitionFilterValue>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return filterAdminCompetitions(data, activeFilter, searchQuery);
  }, [activeFilter, data, searchQuery]);

  return (
    <>
      <AdminTableToolbar
        filters={ADMIN_COMPETITION_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="대회 제목 검색..."
      />

      <AdminDataTable
        columns={COMPETITION_COLUMNS}
        data={filteredData}
        emptyMessage="등록된 대회가 없습니다."
        getRowKey={(row) => row.id}
      />
    </>
  );
}
