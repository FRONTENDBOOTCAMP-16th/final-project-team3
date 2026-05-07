// 서버 컴포넌트
import PostDetailClient from '@/components/community/PostDetailClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  getPost,
  getComments,
  incrementViewCount,
} from '@/services/communityService';
import { notFound } from 'next/navigation';

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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
