import { cache } from 'react';
import { supabase } from '@/lib/supabase';
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

export const getPost = cache(async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(nickname, avatar_url, belt_level, role)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    nickname: data.profiles?.nickname,
    avatar_url: data.profiles?.avatar_url,
    belt_level: data.profiles?.belt_level,
    role: data.profiles?.role,
    profiles: undefined,
  } as Post;
});

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
  const { data, error } = await supabase
    .from('posts')
    .insert({ category, title, content, image_url, user_id })
    .select()
    .single();
  if (error) throw error;
  return data as Post;
}

export async function updatePost(
  id: string,
  fields: { title: string; content: string; image_url?: string },
) {
  const { error } = await supabase.from('posts').update(fields).eq('id', id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  const { error } = await supabase
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
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

export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(nickname, avatar_url, belt_level, role)')
    .eq('post_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map((comment) => ({
    ...comment,
    nickname: (comment.profiles as PostProfile | null)?.nickname,
    avatar_url: (comment.profiles as PostProfile | null)?.avatar_url,
    belt_level: (comment.profiles as PostProfile | null)?.belt_level,
    role: (comment.profiles as PostProfile | null)?.role,
    profiles: undefined,
  })) as Comment[];
}

export async function createComment({
  post_id,
  user_id,
  content,
}: {
  post_id: string;
  user_id: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id, user_id, content })
    .select('*, profiles(nickname, avatar_url, belt_level, role)')
    .single();
  if (error) throw error;

  return {
    ...data,
    nickname: data.profiles?.nickname,
    avatar_url: data.profiles?.avatar_url,
    belt_level: data.profiles?.belt_level,
    role: data.profiles?.role,
    profiles: undefined,
  } as Comment;
}

export async function updateComment(id: string, content: string) {
  const { error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteComment(id: string) {
  const { error } = await supabase
    .from('comments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function incrementViewCount(id: string) {
  await supabase.rpc('increment_view_count', { post_id: id });
}
