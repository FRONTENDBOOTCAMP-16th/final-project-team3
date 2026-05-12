import { supabase } from '@/lib/supabase';
import type { Post, Comment, PostCategory } from '@/types/community';

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(count), profiles(nickname, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((post) => ({
    ...post,
    comment_count: (post.comments as { count: number }[])[0]?.count ?? 0,
    nickname: (post.profiles as { nickname: string; avatar_url: string } | null)
      ?.nickname,
    avatar_url: (
      post.profiles as { nickname: string; avatar_url: string } | null
    )?.avatar_url,
    profiles: undefined,
  }));
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(nickname, avatar_url, belt_level, role)')
    .eq('id', id)
    .single();
  if (error) throw error;

  return {
    ...data,
    nickname: data.profiles?.nickname,
    avatar_url: data.profiles?.avatar_url,
    belt_level: data.profiles?.belt_level,
    role: data.profiles?.role,
    profiles: undefined,
  } as Post;
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
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadPostImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`; // 한글 파일명 제거
  const { error } = await supabase.storage
    .from('post-images')
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
  return data.publicUrl;
}

interface CommentProfile {
  nickname: string;
  avatar_url: string;
  belt_level: string;
  role: string;
}

export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(nickname, avatar_url, belt_level, role)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map((comment) => ({
    ...comment,
    nickname: (comment.profiles as CommentProfile | null)?.nickname,
    avatar_url: (comment.profiles as CommentProfile | null)?.avatar_url,
    belt_level: (comment.profiles as CommentProfile | null)?.belt_level,
    role: (comment.profiles as CommentProfile | null)?.role,
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

export async function deleteComment(id: string) {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) throw error;
}
export async function incrementViewCount(id: string) {
  await supabase.rpc('increment_view_count', { post_id: id });
}
