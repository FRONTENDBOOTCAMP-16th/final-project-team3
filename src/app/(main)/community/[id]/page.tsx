import { Suspense } from 'react';
import type { Metadata } from 'next';
import PostDetailClient from '@/components/community/PostDetailClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  isPublicPostVisible,
  incrementViewCount,
} from '@/services/communityService';
import { getPost, getComments } from '@/services/communityService.server';
import { notFound } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!isPublicPostVisible(post)) {
    return {
      title: '게시글을 찾을 수 없습니다 | Black Belt BJJ',
      description: '존재하지 않거나 삭제된 게시글입니다.',
    };
  }

  const description = post.content.slice(0, 120).replace(/\n/g, ' ');

  return {
    title: `${post.title} | Black Belt BJJ`,
    description: description ?? '주짓수 커뮤니티 게시글 상세 정보',
    openGraph: {
      title: `${post.title} | Black Belt BJJ`,
      description: description ?? '주짓수 커뮤니티 게시글 상세 정보',
      ...(post.image_url && { images: [{ url: post.image_url }] }),
      type: 'article',
    },
  };
}

async function PostDetailContent({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [
    post,
    comments,
    {
      data: { user },
    },
  ] = await Promise.all([
    getPost(id),
    getComments(id),
    supabase.auth.getUser(),
  ]);

  if (!isPublicPostVisible(post)) notFound();

  await incrementViewCount(id);

  return (
    <PostDetailClient
      id={id}
      initialPost={post}
      initialComments={comments}
      userId={user?.id ?? null}
    />
  );
}

export default function PostDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PostDetailContent params={params} />
    </Suspense>
  );
}
