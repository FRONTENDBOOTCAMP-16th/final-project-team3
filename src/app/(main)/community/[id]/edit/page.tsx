import { Suspense } from 'react';
import type { Metadata } from 'next';
import EditClient from '@/components/community/EditClient';
import { canManageContent } from '@/lib/contentPermissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getPost } from '@/services/communityService.server';
import { notFound, redirect } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return { title: '게시글을 찾을 수 없습니다 | Black Belt BJJ' };
  }

  return {
    title: `${post.title} 수정 | Black Belt BJJ`,
    description: `"${post.title}" 게시글을 수정합니다.`,
    robots: { index: false },
  };
}

async function EditContent({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [
    post,
    {
      data: { user },
    },
  ] = await Promise.all([getPost(id), supabase.auth.getUser()]);

  if (!user) redirect('/login');
  if (!post) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (
    !canManageContent({
      currentUserId: user.id,
      authorUserId: post.user_id,
      currentUserRole: profile?.role ?? null,
      authorRole: post.role,
    })
  ) {
    redirect(`/community/${id}`);
  }

  return <EditClient id={id} initialPost={post} />;
}

export default function EditPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditContent params={params} />
    </Suspense>
  );
}
