'use client';

import AdminBadge from '@/components/admin/AdminBadge';
import AdminDataTable, {
  type AdminTableColumn,
} from '@/components/admin/AdminDataTable';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import AdminUserActions from '@/components/admin/users/AdminUserActions';
import {
  ACCOUNT_STATUS_BADGE_VARIANT_MAP,
  ADMIN_USER_FILTERS,
  DOJANG_APPROVAL_BADGE_VARIANT_MAP,
  USER_TYPE_BADGE_VARIANT_MAP,
} from '@/components/admin/users/constants';
import type {
  AdminUserFilterValue,
  AdminUserRow,
} from '@/components/admin/users/types';
import { useAdminTableQueryState } from '@/hooks/useAdminTableQueryState';
import { ADMIN_TABLE_PAGE_SIZE } from '@/lib/adminTableServerPagination';

interface AdminUsersClientProps {
  data: AdminUserRow[];
  totalCount: number;
  pageSize?: number;
}

function UserAvatarCell({
  avatarUrl,
  nickname,
}: {
  avatarUrl: string | null;
  nickname: string;
}) {
  if (avatarUrl) {
    return (
      <div
        role="img"
        aria-label={`${nickname} 프로필 이미지`}
        className="mx-auto aspect-square w-[clamp(2.25rem,3vw,2.75rem)] rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${avatarUrl})` }}
      />
    );
  }

  return (
    <div
      className="mx-auto flex aspect-square w-[clamp(2.25rem,3vw,2.75rem)] items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-500"
      aria-hidden="true"
    >
      {nickname.slice(0, 1)}
    </div>
  );
}

const USER_COLUMNS: AdminTableColumn<AdminUserRow>[] = [
  {
    key: 'avatar_url',
    header: '이미지',
    width: '9%',
    align: 'center',
    truncate: false,
    render: (row) => (
      <UserAvatarCell avatarUrl={row.avatar_url} nickname={row.nickname} />
    ),
  },
  {
    key: 'nickname',
    header: '닉네임 / 이름',
    width: '18%',
    align: 'left',
    truncate: false,
    render: (row) => (
      <div className="flex min-w-0 flex-col gap-1">
        <span
          className="block truncate text-[15px] font-semibold text-zinc-950"
          title={row.nickname}
        >
          {row.nickname}
        </span>
        <span className="block truncate text-sm text-zinc-500" title={row.name}>
          {row.name}
        </span>
      </div>
    ),
  },
  {
    key: 'email',
    header: '이메일',
    width: '18%',
    align: 'left',
    render: (row) => (
      <span className="block truncate" title={row.email}>
        {row.email}
      </span>
    ),
  },
  {
    key: 'user_type',
    header: '유형',
    width: '8%',
    align: 'center',
    truncate: false,
    render: (row) => (
      <AdminBadge
        label={row.user_type}
        variant={USER_TYPE_BADGE_VARIANT_MAP[row.user_type]}
      />
    ),
  },
  {
    key: 'account_status',
    header: '계정',
    width: '8%',
    align: 'center',
    truncate: false,
    render: (row) => (
      <AdminBadge
        label={row.account_status}
        variant={ACCOUNT_STATUS_BADGE_VARIANT_MAP[row.account_status]}
      />
    ),
  },
  {
    key: 'dojang_approval_status',
    header: '도장 승인',
    width: '10%',
    align: 'center',
    truncate: false,
    render: (row) =>
      row.dojang_approval_status ? (
        <AdminBadge
          label={row.dojang_approval_status}
          variant={
            DOJANG_APPROVAL_BADGE_VARIANT_MAP[row.dojang_approval_status]
          }
        />
      ) : (
        <span className="text-zinc-400">-</span>
      ),
  },
  { key: 'joined_at', header: '가입일', width: '10%', align: 'center' },
  {
    key: 'id',
    header: '관리',
    width: '17%',
    align: 'center',
    truncate: false,
    render: (row) => <AdminUserActions user={row} />,
  },
];

export default function AdminUsersClient({
  data,
  totalCount,
  pageSize = ADMIN_TABLE_PAGE_SIZE,
}: AdminUsersClientProps) {
  const {
    activeFilter,
    currentPage,
    searchQuery,
    setFilter,
    setPage,
    setSearchQuery,
    commitSearch,
  } = useAdminTableQueryState<AdminUserFilterValue>({
    filterParamName: 'status',
    defaultFilter: 'all',
    validFilters: ADMIN_USER_FILTERS.map((filter) => filter.value),
  });

  return (
    <>
      <AdminTableToolbar
        filters={ADMIN_USER_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={commitSearch}
        searchPlaceholder="닉네임, 이름, 이메일 검색..."
        searchAriaLabel="닉네임, 이름 또는 이메일 검색"
      />

      <AdminDataTable
        columns={USER_COLUMNS}
        currentPage={currentPage}
        data={data}
        emptyMessage="등록된 사용자가 없습니다."
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
