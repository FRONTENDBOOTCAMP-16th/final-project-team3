import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { supabasePublic } from '@/lib/supabase/public';
import { cacheTag, cacheLife } from 'next/cache';
import { getSportBySlug } from '@/constants/sports';
import SportCommunityClient from '@/components/community/SportCommunityClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Post } from '@/types/community';

interface Props {
  params: Promise<{ sport: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport: slug } = await params;
  const sport = getSportBySlug(slug);
  if (!sport) return {};
  return {
    title: `${sport.name} 커뮤니티 | Activio`,
    description: `${sport.name} 수련자들의 이야기를 나누는 공간`,
  };
}

async function getPosts(slug: string): Promise<Post[]> {
  'use cache';
  cacheTag(`posts-sport-${slug}`);
  cacheLife('minutes');

  const { data, error } = await supabasePublic
    .from('posts')
    .select('*, active_comment_counts(count), profiles(nickname, avatar_url)')
    .is('deleted_at', null)
    .eq('status', 'published')
    .eq('sport', slug)
    .order('created_at', { ascending: false })
    .range(0, 49);

  if (error) return [];

  return data.map((post) => ({
    ...post,
    comment_count:
      (post.active_comment_counts as { count: number }[])[0]?.count ?? 0,
    nickname: (post.profiles as { nickname: string; avatar_url: string } | null)?.nickname,
    avatar_url: (post.profiles as { nickname: string; avatar_url: string } | null)?.avatar_url,
    profiles: undefined,
  })) as Post[];
}

async function SportContent({ slug }: { slug: string }) {
  const sport = getSportBySlug(slug);
  if (!sport) notFound();

  const initialPosts = await getPosts(slug);
  return <SportCommunityClient initialPosts={initialPosts} sport={sport} />;
}

export default async function SportCommunityPage({ params }: Props) {
  const { sport } = await params;
  return (
    <Suspense fallback={<LoadingSpinner label="불러오는 중" />}>
      <SportContent slug={sport} />
    </Suspense>
  );
}
