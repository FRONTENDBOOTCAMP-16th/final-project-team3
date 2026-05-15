import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types/user';
import { ProfileUpdateForm, MyPost, MyPostQueryRow } from '@/types/mypage';

export async function fetchMyProfile(): Promise<Profile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateMyProfile(form: ProfileUpdateForm): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { error } = await supabase
    .from('profiles')
    .update(form)
    .eq('id', user.id);

  if (error) throw error;
}

export async function fetchMyPosts(page: number): Promise<MyPost[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const limit = 10;
  const from = page * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      category,
      image_url,
      view_count,
      created_at,
      profiles (
        nickname,
        avatar_url
      ),
      comments (count)
    `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return (data ?? []).map((post) => {
    const row = post as unknown as MyPostQueryRow;
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      image_url: row.image_url,
      view_count: row.view_count,
      created_at: row.created_at,
      nickname: row.profiles?.nickname ?? '',
      avatar_url: row.profiles?.avatar_url ?? '',
      comment_count: row.comments?.[0]?.count ?? 0,
    };
  });
}
export async function deleteMyAccount(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const res = await fetch('/api/delete-account', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id }),
  });

  if (!res.ok) {
    throw new Error('회원탈퇴에 실패했습니다.');
  }

  await supabase.auth.signOut();
}

export async function fetchMyPostCount(): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return count ?? 0;
}

export async function fetchMyCommentCount(): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return count ?? 0;
}
