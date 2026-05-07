import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/user';
import { ProfileUpdateForm, MyPost } from '@/types/mypage';

// 내 프로필 조회
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
// 내 프로필 수정
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

// 내가 쓴 게시글 조회 (무한스크롤용)
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
      'id, title, content, category, nickname, avatar_url, image_url, view_count, created_at, comment_count',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data ?? [];
}

// 회원 탈퇴
export async function deleteMyAccount(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 내 게시글 수 조회
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

// 내 댓글 수 조회
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
