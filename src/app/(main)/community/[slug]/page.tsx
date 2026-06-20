import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostDetailClient from '@/components/community/PostDetailClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isPublicPostVisible } from '@/services/communityService';
import { getPost, getComments } from '@/services/communityService.server';
import { extractPostId } from '@/lib/slug';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = extractPostId(slug);
  if (!id) return { title: '게시글을 찾을 수 없습니다 | Activio' };

  const post = await getPost(id);
  if (!isPublicPostVisible(post)) {
    return {
      title: '게시글을 찾을 수 없습니다 | Activio',
      description: '존재하지 않거나 삭제된 게시글입니다.',
    };
  }

  const description = post.content.slice(0, 120).replace(/\n/g, ' ');
  return {
    title: `${post.title} | Activio`,
    description: description ?? 'Activio 커뮤니티 게시글 상세 정보',
    openGraph: {
      title: `${post.title} | Activio`,
      description: description ?? '주짓수 커뮤니티 게시글 상세 정보',
      ...(post.image_url && { images: [{ url: post.image_url }] }),
      type: 'article',
    },
  };
}

async function PostDetailContent({ params }: Props) {
  const { slug } = await params;
  const id = extractPostId(slug);
  if (!id) notFound();

  const post = await getPost(id);
  if (!isPublicPostVisible(post)) notFound();

  const supabase = await createSupabaseServerClient();
  const [
    comments,
    {
      data: { user },
    },
  ] = await Promise.all([getComments(id), supabase.auth.getUser()]);

  const currentUserRole = user?.id
    ? ((
        await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
      ).data?.role ?? null)
    : null;

  return (
    <PostDetailClient
      id={id}
      initialPost={post}
      initialComments={comments}
      userId={user?.id ?? null}
      currentUserRole={currentUserRole}
    />
  );
}

export default function PostDetailPage({ params }: Props) {
  return <PostDetailContent params={params} />;
}
