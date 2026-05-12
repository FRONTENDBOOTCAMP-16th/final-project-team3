// community/[id]/page.tsx
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import PostDetailClient from '@/components/community/PostDetailClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  getPost,
  getComments,
  incrementViewCount,
} from '@/services/communityService';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: '게시글을 찾을 수 없습니다 | Black Belt BJJ',
      description: '존재하지 않거나 삭제된 게시글입니다.',
    };
  }

  const description = post.content.slice(0, 120).replace(/\n/g, ' ');

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      ...(post.image_url && { images: [{ url: post.image_url }] }),
      type: 'article',
    },
  };
}

async function getInitialData(id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );

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

  if (!post) notFound();

  await incrementViewCount(id);

  return { post, comments, userId: user?.id ?? null };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const { post, comments, userId } = await getInitialData(id);

  return (
    <PostDetailClient
      id={id}
      initialPost={post}
      initialComments={comments}
      userId={userId}
    />
  );
}
