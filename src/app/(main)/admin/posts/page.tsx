import AdminHeader from '@/components/admin/AdminHeader';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import { ADMIN_POST_FILTERS } from '@/constants/adminPostFilters';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPostActions from '@/components/admin/AdminPostActions';
import AdminBadge from '@/components/admin/AdminBadge';

type AdminPostStatus = 'published' | 'hidden';
type AdminPostCategory = '일반' | '도장' | '대회' | '공지';
type BadgeVariant = 'gray' | 'blue' | 'purple' | 'red' | 'green' | 'yellow';

interface AdminPostRow {
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
  도장: 'blue',
  대회: 'purple',
  공지: 'red',
};

function getPostStatusBadge(row: AdminPostRow): {
  label: string;
  variant: BadgeVariant;
} {
  if (row.deleted_at) {
    return { label: '삭제', variant: 'red' };
  }

  if (row.status === 'hidden') {
    return { label: '숨김', variant: 'yellow' };
  }

  return { label: '게시중', variant: 'green' };
}

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
    render: (row) => <AdminPostActions id={row.id} title={row.title} />,
  },
] satisfies {
  key: keyof AdminPostRow;
  header: string;
  render?: (row: AdminPostRow) => React.ReactNode;
}[];

const postData: AdminPostRow[] = [
  {
    id: '0f5c5424-6287-44fc-aa14-3e894fbe629d',
    category: '일반',
    title: '첫 번째 게시글',
    author: '정론',
    status: 'published',
    deleted_at: null,
    view_count: 120,
    report_count: 0,
    created_at: '2026-04-28',
  },
  {
    id: '1245fc21-1089-4526-a1ec-a1467ac4eb78',
    category: '도장',
    title: '도장 홍보합니다',
    author: '민재',
    status: 'hidden',
    deleted_at: null,
    view_count: 340,
    report_count: 1,
    created_at: '2026-04-27',
  },
  {
    id: '5cc0e81d-6e92-4083-adb2-90f090fcb94a',
    category: '대회',
    title: '이번 주 대회 일정 공유',
    author: '지훈',
    status: 'published',
    deleted_at: null,
    view_count: 210,
    report_count: 0,
    created_at: '2026-04-26',
  },
  {
    id: '748b7cff-10ac-46af-9d0f-72dd975b75af',
    category: '일반',
    title: '주짓수 질문 있습니다',
    author: '수현',
    status: 'published',
    deleted_at: '2026-04-30T10:00:00Z',
    view_count: 89,
    report_count: 2,
    created_at: '2026-04-25',
  },
];

export default function AdminPostPage() {
  return (
    <main className="w-full min-h-screen space-y-2">
      <AdminHeader page="post" />
      <AdminTableToolbar filters={ADMIN_POST_FILTERS} />
      <AdminDataTable columns={postColumns} data={postData} />
    </main>
  );
}