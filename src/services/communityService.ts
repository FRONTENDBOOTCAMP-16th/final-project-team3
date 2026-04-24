import { supabase } from '@/lib/supabase';
import type { Post, Comment, PostCategory } from '@/types/community';

// export async function getPosts() {
//   const { data, error } = await supabase
//     .from('posts')
//     .select('*, profiles(nickname, avatar_url, belt_level)')
//     .order('created_at', { ascending: false });
//   console.log('data:', data);
//   console.log('error:', error);

//   if (error) throw error;

//   return data.map((post: any) => ({
//     ...post,
//     nickname: post.profiles?.nickname,
//     avatar_url: post.profiles?.avatar_url,
//     belt_level: post.profiles?.belt_level,
//     profiles: undefined,
//   })) as Post[];
// }

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('data:', data);
  console.log('error:', error);

  if (error) throw error;

  return data as Post[];
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(nickname, avatar_url, belt_level)')
    .eq('id', id)
    .single();
  if (error) throw error;

  return {
    ...data,
    nickname: data.profiles?.nickname,
    avatar_url: data.profiles?.avatar_url,
    belt_level: data.profiles?.belt_level,
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
  fields: { title?: string; content?: string; image_url?: string },
) {
  const { error } = await supabase.from('posts').update(fields).eq('id', id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadPostImage(file: File): Promise<string> {
  const fileName = `${Date.now()}_${file.name}`;
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
    .select('*, profiles(nickname, avatar_url, belt_level)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  return data.map((comment: any) => ({
    ...comment,
    nickname: comment.profiles?.nickname,
    avatar_url: comment.profiles?.avatar_url,
    belt_level: comment.profiles?.belt_level,
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
    .select('*, profiles(nickname, avatar_url, belt_level)')
    .single();
  if (error) throw error;

  return {
    ...data,
    nickname: data.profiles?.nickname,
    avatar_url: data.profiles?.avatar_url,
    belt_level: data.profiles?.belt_level,
    profiles: undefined,
  } as Comment;
}

export async function deleteComment(id: string) {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) throw error;
}
