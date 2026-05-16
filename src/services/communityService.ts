import { supabase } from '@/lib/supabase/client';
import type { Post, Comment, PostCategory } from '@/types/community';

interface ProfileBase {
  nickname: string;
  avatar_url: string;
}

interface PostProfile extends ProfileBase {
  belt_level: string;
  role: string;
}

export async function getPosts(page = 0, pageSize = 10) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(count), profiles(nickname, avatar_url)')
    .is('deleted_at', null)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return data.map((post) => ({
    ...post,
    comment_count: (post.comments as { count: number }[])[0]?.count ?? 0,
    nickname: (post.profiles as ProfileBase | null)?.nickname,
    avatar_url: (post.profiles as ProfileBase | null)?.avatar_url,
    profiles: undefined,
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
  user_id,
}: {
  category: PostCategory;
  title: string;
  content: string;
  image_url?: string;
  user_id: string;
}) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, title, content, image_url, user_id }),
  });
  if (!res.ok) throw new Error('게시글 작성 실패');
  const { post } = await res.json();
  return post as Post;
}

export async function updatePost(
  id: string,
  fields: { title: string; content: string; image_url?: string },
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
  const fileName = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('post-images')
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
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
