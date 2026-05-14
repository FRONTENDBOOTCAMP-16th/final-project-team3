import { supabasePublic } from '@/lib/supabase/public';
import { cacheTag } from 'next/cache';
import type { Post, Comment } from '@/types/community';

export async function getPost(id: string): Promise<Post | null> {
  'use cache';
  cacheTag(`post-${id}`);

  const { data, error } = await supabasePublic
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
}

export async function getComments(postId: string): Promise<Comment[]> {
  'use cache';
  cacheTag(`comments-${postId}`);

  const { data, error } = await supabasePublic
    .from('comments')
    .select('*, profiles(nickname, avatar_url, belt_level, role)')
    .eq('post_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map((comment) => ({
    ...comment,
    nickname: comment.profiles?.nickname,
    avatar_url: comment.profiles?.avatar_url,
    belt_level: comment.profiles?.belt_level,
    role: comment.profiles?.role,
    profiles: undefined,
  })) as Comment[];
}
