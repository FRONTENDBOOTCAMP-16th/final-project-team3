import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types/user';
import { ProfileUpdateForm, MyPost } from '@/types/mypage';

interface PostQueryRow {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  view_count: number;
  created_at: string;
  profiles: { nickname: string; avatar_url: string } | null;
  comments: { count: number }[];
}

async function getAuthUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');
  return user;
}

export async function fetchMyProfile(): Promise<Profile> {
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateMyProfile(form: ProfileUpdateForm): Promise<void> {
  const user = await getAuthUser();

  const { error } = await supabase
    .from('profiles')
    .update(form)
    .eq('id', user.id);

  if (error) throw error;
}

export async function fetchMyPosts(page: number): Promise<MyPost[]> {
  const user = await getAuthUser();

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
    const p = post as unknown as PostQueryRow;
    return {
      id: p.id,
      title: p.title,
      content: p.content,
      category: p.category,
      image_url: p.image_url,
      view_count: p.view_count,
      created_at: p.created_at,
      nickname: p.profiles?.nickname ?? '',
      avatar_url: p.profiles?.avatar_url ?? '',
      comment_count: p.comments?.[0]?.count ?? 0,
    };
  });
}

export async function deleteMyAccount(): Promise<void> {
  const user = await getAuthUser();

  const res = await fetch('/api/delete-account', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id }),
  });

  if (!res.ok) throw new Error('회원탈퇴에 실패했습니다.');

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
