import { supabase } from '@/lib/supabase/client';
import type { Post, PostCategory } from '@/types/community';

interface ProfileBase {
  nickname: string;
  avatar_url: string;
}

export async function getPosts(page = 0, pageSize = 10) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('posts')
    .select('*, active_comment_counts(count), profiles(nickname, avatar_url)')
    .is('deleted_at', null)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return data.map((post) => ({
    ...post,
    comment_count:
      (post.active_comment_counts as { count: number }[])[0]?.count ?? 0,
    nickname: (post.profiles as ProfileBase | null)?.nickname,
    avatar_url: (post.profiles as ProfileBase | null)?.avatar_url,
    profiles: undefined,
  }));
}

export async function getSportPosts(sport: string, page = 0, pageSize = 10) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('posts')
    .select('*, active_comment_counts(count), profiles(nickname, avatar_url)')
    .is('deleted_at', null)
    .eq('status', 'published')
    .eq('sport', sport)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return data.map((post) => ({
    ...post,
    comment_count:
      (post.active_comment_counts as { count: number }[])[0]?.count ?? 0,
    nickname: (post.profiles as ProfileBase | null)?.nickname,
    avatar_url: (post.profiles as ProfileBase | null)?.avatar_url,
    profiles: undefined,
  }));
}

export async function getPromoPosts(limit = 20) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, profiles(nickname)')
    .is('deleted_at', null)
    .eq('status', 'published')
    .eq('category', 'promo')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((post) => ({
    id: post.id as string,
    title: post.title as string,
    content: post.content as string,
    nickname: (post.profiles as unknown as ProfileBase | null)?.nickname ?? '',
  }));
}

export function isPublicPostVisible(
  post: Post | null | undefined,
): post is Post {
  if (!post) {
    return false;
  }

  return (
    (post.deleted_at === null || post.deleted_at === undefined) &&
    post.status !== 'hidden'
  );
}

export async function createPost({
  category,
  title,
  content,
  image_url,
  video_url,
  sport,
  user_id,
}: {
  category: PostCategory;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  sport?: string;
  user_id: string;
}) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, title, content, image_url, video_url, sport, user_id }),
  });
  if (!res.ok) throw new Error('게시글 작성 실패');
  const { post } = await res.json();
  return post as Post;
}

export async function updatePost(
  id: string,
  fields: { title: string; content: string; image_url?: string | null; video_url?: string | null },
) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error('게시글 수정 실패');
}

export async function deletePost(id: string) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('게시글 삭제 실패');
}

export async function uploadPostImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('post-images')
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadPostVideo(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('post-videos')
    .upload(fileName, file, { contentType: file.type, cacheControl: '3600' });
  if (error) {
    console.error('[uploadPostVideo] Supabase error:', error);
    throw error;
  }
  const { data } = supabase.storage.from('post-videos').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function updateComment(id: string, content: string) {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('댓글 수정 실패');
}

export async function deleteComment(id: string) {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('댓글 삭제 실패');
}
