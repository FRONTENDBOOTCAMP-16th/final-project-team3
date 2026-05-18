import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types/user';
import { ProfileUpdateForm, MyPost } from '@/types/mypage';
import { normalizeBeltLevel } from '@/constants/belt';

async function getAuthUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');
  return user;
}

interface PostQueryRow {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  view_count: number;
  created_at: string;
  profiles: { nickname: string; avatar_url: string } | null;
  active_comment_counts: { count: number }[];
}

export async function fetchMyProfile(): Promise<Profile> {
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return {
    ...data,
    belt_level: normalizeBeltLevel(data.belt_level),
  };
}

const MIN_NICKNAME_LENGTH = 2;

export async function updateMyProfile(
  form: ProfileUpdateForm,
): Promise<Profile> {
  const user = await getAuthUser();
  const nickname = form.nickname.trim();

  if (nickname.length < MIN_NICKNAME_LENGTH) {
    throw new Error('닉네임은 2자 이상이어야 합니다.');
  }

  const nicknameCheckParams = new URLSearchParams({
    nickname,
    excludeUserId: user.id,
  });
  const nicknameCheckResponse = await fetch(
    `/api/check-nickname?${nicknameCheckParams.toString()}`,
  );
  const nicknameCheckData = await nicknameCheckResponse.json();

  if (!nicknameCheckResponse.ok) {
    throw new Error(
      nicknameCheckData.error ?? '닉네임 확인 중 오류가 발생했습니다.',
    );
  }
  if (!nicknameCheckData.available) {
    throw new Error('이미 사용 중인 닉네임입니다.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...form,
      nickname,
      belt_level: normalizeBeltLevel(form.belt_level),
    })
    .eq('id', user.id)
    .select('*')
    .single();

  if (error) throw error;
  return {
    ...data,
    belt_level: normalizeBeltLevel(data.belt_level),
  };
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
      active_comment_counts (count)
    `,
    )
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .eq('status', 'published')
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
      comment_count: p.active_comment_counts?.[0]?.count ?? 0,
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
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .eq('status', 'published');

  return count ?? 0;
}

export async function fetchMyCommentCount(): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data: posts } = await supabase
    .from('posts')
    .select('id')
    .is('deleted_at', null)
    .eq('status', 'published');

  if (!posts || posts.length === 0) return 0;

  const postIds = posts.map((p) => p.id);

  const { count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('post_id', postIds)
    .is('deleted_at', null);

  return count ?? 0;
}
