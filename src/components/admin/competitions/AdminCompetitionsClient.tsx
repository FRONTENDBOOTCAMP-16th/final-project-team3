'use client';

import { useMemo, useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

import AdminBadge from '@/components/admin/AdminBadge';
import AdminDataTable, {
  type AdminTableColumn,
} from '@/components/admin/AdminDataTable';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import {
  ADMIN_COMPETITION_FILTERS,
  COMPETITION_STATUS_BADGE_VARIANT_MAP,
} from '@/components/admin/competitions/constants';
import type {
  AdminCompetitionFilterValue,
  AdminCompetitionRow,
} from '@/components/admin/competitions/types';
import { filterAdminCompetitions } from '@/components/admin/competitions/utils';

interface AdminCompetitionsClientProps {
  data: AdminCompetitionRow[];
}

const COMPETITION_COLUMNS: AdminTableColumn<AdminCompetitionRow>[] = [
  { key: 'name', header: '대회 제목', width: '35%', align: 'left' },
  { key: 'location', header: '장소', width: '20%', align: 'left' },
  {
    key: 'status',
    header: '상태',
    width: '10%',
    align: 'center',
    render: (row) => (
      <AdminBadge
        label={row.status}
        variant={COMPETITION_STATUS_BADGE_VARIANT_MAP[row.status]}
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
    key: 'apply_url',
    header: '링크',
    width: '5%',
    align: 'center',
    render: (row) =>
      row.apply_url ? (
        <a
          href={row.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-zinc-500 hover:text-black transition-colors"
          title="링크 이동"
        >
          <LinkIcon className="w-4 h-4" />
        </a>
      ) : (
        <span className="text-zinc-400">-</span>
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
