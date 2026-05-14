export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import EditClient from '@/components/community/EditClient';
import { canManageContent } from '@/lib/contentPermissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getPost } from '@/services/communityService';
import { notFound, redirect } from 'next/navigation';

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

async function getInitialData(id: string) {
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

  return { post };
}

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const { post } = await getInitialData(id);

  return <EditClient id={id} initialPost={post} />;
}
