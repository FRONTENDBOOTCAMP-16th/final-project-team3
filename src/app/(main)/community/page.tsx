import { Suspense } from 'react';
import CommunityClient from '@/components/community/CommunityClient';
import { supabasePublic } from '@/lib/supabase/public';
import { cacheTag, cacheLife } from 'next/cache';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Post } from '@/types/community';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커뮤니티 | Black Belt BJJ',
  description: '주짓수 수련자들의 이야기, 기술 분석, 도장 정보를 나누는 공간',
  openGraph: {
    title: '커뮤니티 | Black Belt BJJ',
    description: '주짓수 수련자들의 이야기, 기술 분석, 도장 정보를 나누는 공간',
  },
};

async function getPosts(): Promise<Post[]> {
  'use cache';
  cacheTag('posts-list');
  cacheLife('minutes');

  const { data, error } = await supabasePublic
    .from('posts')
    .select('*, comments(count), profiles(nickname, avatar_url)')
    .order('created_at', { ascending: false })
    .range(0, 9);

  if (error) return [];

  return data.map((post) => ({
    ...post,
    comment_count: (post.comments as { count: number }[])[0]?.count ?? 0,
    nickname: (post.profiles as { nickname: string; avatar_url: string } | null)
      ?.nickname,
    avatar_url: (
      post.profiles as { nickname: string; avatar_url: string } | null
    )?.avatar_url,
    profiles: undefined,
  })) as Post[];
}

async function CommunityContent() {
  const initialPosts = await getPosts();
  return <CommunityClient initialPosts={initialPosts} />;
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CommunityContent />
    </Suspense>
  );
}
