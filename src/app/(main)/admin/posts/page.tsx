import AdminHeader from '@/components/admin/AdminHeader';
import AdminPostTableClient, {
  type AdminPostRow,
  type AdminPostCategory,
  type AdminPostStatus,
} from '@/components/admin/AdminPostTableClient';
import { supabase } from '@/lib/supabase';

type DbPostCategory = 'personal' | 'promo' | 'notice';

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

function getAuthorName(profiles: PostQueryRow['profiles']) {
  if (!profiles) return '알 수 없음';

  if (Array.isArray(profiles)) {
    return profiles[0]?.nickname ?? '알 수 없음';
  }

  return profiles.nickname ?? '알 수 없음';
}

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
    `,
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
    <main className="min-h-screen w-full space-y-2">
      <AdminHeader page="post" />
      <AdminPostTableClient data={postData} />
    </main>
  );
}