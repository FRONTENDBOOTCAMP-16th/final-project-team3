import AdminPostTableClient from '@/components/admin/posts/AdminPostsTableClient';
import type { PostQueryRow } from '@/components/admin/posts/types';
import { mapPostQueryRowsToAdminPostRows } from '@/components/admin/posts/utils';
import { createServerSupabaseClient } from '@/lib/createServerSupabaseClient';

async function getAdminPosts() {
  const supabase = await createServerSupabaseClient();

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

  return mapPostQueryRowsToAdminPostRows((data ?? []) as PostQueryRow[]);
}

export default async function AdminPostPage() {
  const postData = await getAdminPosts();

  return <AdminPostTableClient data={postData} />;
}
