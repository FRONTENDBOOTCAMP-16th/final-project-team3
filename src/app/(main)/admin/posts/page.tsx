import AdminHeader from '@/components/admin/AdminHeader';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import { ADMIN_POST_FILTERS } from '@/constants/adminPostFilters';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPostActions from '@/components/admin/AdminPostActions';
import AdminBadge from '@/components/admin/AdminBadge';
import { supabase } from '@/lib/supabase';

type AdminPostStatus = 'published' | 'hidden';
type AdminPostCategory = '일반' | '도장홍보' | '공지';
type DbPostCategory = 'personal' | 'promo' | 'notice';
type BadgeVariant = 'gray' | 'blue' | 'red' | 'green' | 'yellow';

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

type ProfileRow = {
  nickname: string | null;
};

type PostQueryRow = {
  id: string;
  category: DbPostCategory;
  title: string;
  status: AdminPostStatus;
  deleted_at: string | null;
  view_count: number | null;
  report_count: number | null;
  created_at: string;
  profiles: ProfileRow | ProfileRow[] | null;
};

const categoryLabelMap: Record<DbPostCategory, AdminPostCategory> = {
  personal: '일반',
  promo: '도장홍보',
  notice: '공지',
};

const categoryBadgeVariantMap: Record<AdminPostCategory, BadgeVariant> = {
  일반: 'gray',
  도장홍보: 'blue',
  공지: 'red',
};

function getAuthorName(profiles: PostQueryRow['profiles']) {
  if (!profiles) return '알 수 없음';

  if (Array.isArray(profiles)) {
    return profiles[0]?.nickname ?? '알 수 없음';
  }

  return profiles.nickname ?? '알 수 없음';
}

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

 

export default async function AdminPostPage() {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      category,
      title,
      status,
      deleted_at,
      view_count,
      report_count,
      created_at,
      profiles (
        nickname
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const posts = (data ?? []) as unknown as PostQueryRow[];

  const postData: AdminPostRow[] = posts.map((post) => ({
    id: post.id,
    category: categoryLabelMap[post.category],
    title: post.title,
    author: getAuthorName(post.profiles),
    status: post.status,
    deleted_at: post.deleted_at,
    view_count: post.view_count ?? 0,
    report_count: post.report_count ?? 0,
    created_at: post.created_at.slice(0, 10),
  }));

  return (
    <main className="w-full min-h-screen space-y-2">
      <AdminHeader page="post" />
      <AdminTableToolbar filters={ADMIN_POST_FILTERS} />
      <AdminDataTable columns={postColumns} data={postData} />
    </main>
  );
}