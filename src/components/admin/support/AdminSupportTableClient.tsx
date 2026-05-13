'use client';

import { useMemo, useState } from 'react';

import AdminBadge from '@/components/admin/AdminBadge';
import AdminDataTable, {
  type AdminTableColumn,
} from '@/components/admin/AdminDataTable';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import AdminSupportDojangActions from '@/components/admin/support/AdminSupportDojangActions';
import AdminSupportReportActions from '@/components/admin/support/AdminSupportReportActions';
import {
  DOJANG_STATUS_BADGE_VARIANT_MAP,
  REPORT_ACTION_BADGE_VARIANT_MAP,
  REPORT_POST_STATUS_BADGE_VARIANT_MAP,
  REPORT_STATUS_BADGE_VARIANT_MAP,
  SUPPORT_SECTION_FILTERS,
} from '@/components/admin/support/constants';
import type {
  AdminDojangVerificationRow,
  AdminReportRow,
  SupportSection,
} from '@/components/admin/support/types';
import {
  filterDojangVerifications,
  filterReports,
} from '@/components/admin/support/utils';

interface AdminSupportTableClientProps {
  dojangVerifications: AdminDojangVerificationRow[];
  reports: AdminReportRow[];
  initialSection: SupportSection;
}

const DOJANG_COLUMNS: AdminTableColumn<AdminDojangVerificationRow>[] = [
  { key: 'dojang_name', header: '도장명', width: '12%', align: 'left' },
  { key: 'representative', header: '대표자', width: '10%', align: 'center' },
  { key: 'phone', header: '연락처', width: '13%', align: 'center' },
  { key: 'email', header: '이메일', width: '16%', align: 'left' },
  { key: 'address', header: '주소', width: '18%', align: 'left' },
  { key: 'requested_at', header: '요청 날짜', width: '9%', align: 'center' },
  {
    key: 'status',
    header: '상태',
    width: '8%',
    align: 'center',
    truncate: false,
    render: (row) => (
      <AdminBadge
        label={row.status}
        variant={DOJANG_STATUS_BADGE_VARIANT_MAP[row.status]}
      />
    ),
  },
  {
    key: 'id',
    header: '관리',
    width: '14%',
    align: 'center',
    truncate: false,
    render: (row) => <AdminSupportDojangActions row={row} />,
  },
];

const REPORT_COLUMNS: AdminTableColumn<AdminReportRow>[] = [
  { key: 'post_title', header: '게시글 제목', width: '18%', align: 'left' },
  { key: 'reason', header: '사유', width: '14%', align: 'left' },
  { key: 'reporter', header: '신고자', width: '9%', align: 'center' },
  { key: 'reported_at', header: '신고 날짜', width: '9%', align: 'center' },
  {
    key: 'post_status_label',
    header: '게시글 상태',
    width: '8%',
    align: 'center',
    truncate: false,
    render: (row) => (
      <AdminBadge
        label={row.post_status_label}
        variant={REPORT_POST_STATUS_BADGE_VARIANT_MAP[row.post_status_label]}
      />
    ),
  },
  {
    key: 'process_status',
    header: '처리 상태',
    width: '8%',
    align: 'center',
    truncate: false,
    render: (row) => (
      <AdminBadge
        label={row.process_status}
        variant={REPORT_STATUS_BADGE_VARIANT_MAP[row.process_status]}
      />
    ),
  },
  {
    key: 'action_result',
    header: '처리 결과',
    width: '11%',
    align: 'center',
    truncate: false,
    render: (row) => (
      row.action_result === '-' ? (
        <span className="text-sm text-zinc-400">-</span>
      ) : (
        <AdminBadge
          label={row.action_result}
          variant={REPORT_ACTION_BADGE_VARIANT_MAP[row.action_result]}
        />
      )
    ),
  },
  { key: 'handled_at', header: '처리 날짜', width: '11%', align: 'center' },
  {
    key: 'id',
    header: '관리',
    width: '12%',
    align: 'center',
    truncate: false,
    render: (row) => <AdminSupportReportActions row={row} />,
  },
];

export default function AdminSupportTableClient({
  dojangVerifications,
  reports,
  initialSection,
}: AdminSupportTableClientProps) {
  const [activeSection, setActiveSection] =
    useState<SupportSection>(initialSection);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDojangVerifications = useMemo(() => {
    return filterDojangVerifications(dojangVerifications, searchQuery);
  }, [dojangVerifications, searchQuery]);

  const filteredReports = useMemo(() => {
    return filterReports(reports, searchQuery);
  }, [reports, searchQuery]);

  const handleSectionChange = (nextSection: SupportSection) => {
    setActiveSection(nextSection);
    setSearchQuery('');
  };

  const searchPlaceholder =
    activeSection === 'dojang'
      ? '도장명, 주소 검색...'
      : '게시글 제목 검색...';

  return (
    <>
      <AdminTableToolbar
        filters={SUPPORT_SECTION_FILTERS}
        activeFilter={activeSection}
        onFilterChange={handleSectionChange}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder={searchPlaceholder}
      />

      {activeSection === 'dojang' ? (
        <AdminDataTable
          columns={DOJANG_COLUMNS}
          data={filteredDojangVerifications}
          emptyMessage="도장 인증 요청이 없습니다."
          getRowKey={(row) => row.id}
        />
      ) : (
        <AdminDataTable
          columns={REPORT_COLUMNS}
          data={filteredReports}
          emptyMessage="신고 내역이 없습니다."
          getRowKey={(row) => row.id}
        />
      )}
    </>
  );
}
