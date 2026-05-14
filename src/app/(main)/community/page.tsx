import CommunityClient from '@/components/community/CommunityClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
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

export const dynamic = 'force-dynamic';

async function getPosts(): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
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

export default async function CommunityPage() {
  const initialPosts = await getPosts();
  return <CommunityClient initialPosts={initialPosts} />;
}
