import AdminHeader from '@/components/admin/AdminHeader';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import { ADMIN_POST_FILTERS } from '@/constants/adminPostFilters';
import AdminDataTable from '@/components/admin/AdminDataTable';
import { Eye, Pencil, Trash2 } from 'lucide-react';

type AdminPostRow = {
  id: string;
  category: string;
  title: string;
  author: string;
  view_count: number;
  report_count: number;
  created_at: string;
  updated_at: string;
};

const postColumns = [
  { key: 'category', header: '카테고리' },
  { key: 'title', header: '제목' },
  { key: 'author', header: '작성자' },
  { key: 'view_count', header: '조회수' },
  { key: 'report_count', header: '신고수' },
  { key: 'created_at', header: '작성일' },
  { key: 'updated_at', header: '수정일' },
  {
    key: 'id',
    header: '관리',
    render: (row) => (
      <div className="flex gap-2">
        <button type="button" aria-label={`${row.title} 상세보기`}>
          <Eye size={16} />
        </button>

        <button type="button" aria-label={`${row.title} 수정`}>
          <Pencil size={16} />
        </button>

        <button type="button" aria-label={`${row.title} 삭제`}>
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
] satisfies {
  key: keyof AdminPostRow;
  header: string;
  render?: (row: AdminPostRow) => React.ReactNode;
}[];

const postData: AdminPostRow[] = [
  {
    id: '1',
    category: '일반',
    title: '첫 번째 게시글',
    author: '정론',
    view_count: 120,
    report_count: 0,
    created_at: '2026-04-28',
    updated_at: '2026-04-28',
  },
  {
    id: '2',
    category: '도장',
    title: '도장 홍보합니다',
    author: '민재',
    view_count: 340,
    report_count: 1,
    created_at: '2026-04-27',
    updated_at: '2026-04-27',
  },
  {
    id: '3',
    category: '대회',
    title: '이번 주 대회 일정 공유',
    author: '지훈',
    view_count: 210,
    report_count: 0,
    created_at: '2026-04-26',
    updated_at: '2026-04-26',
  },
  {
    id: '4',
    category: '일반',
    title: '주짓수 질문 있습니다',
    author: '수현',
    view_count: 89,
    report_count: 2,
    created_at: '2026-04-25',
    updated_at: '2026-04-26',
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
