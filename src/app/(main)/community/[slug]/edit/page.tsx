import type { Metadata } from 'next';
import EditClient from '@/components/community/EditClient';
import { canManageContent } from '@/lib/contentPermissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getPost } from '@/services/communityService.server';
import { notFound, redirect } from 'next/navigation';
import { extractPostId, buildPostUrl } from '@/lib/slug';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = extractPostId(slug);
  if (!id) return { title: '게시글을 찾을 수 없습니다 | Black Belt BJJ' };

  const post = await getPost(id);
  if (!post) return { title: '게시글을 찾을 수 없습니다 | Black Belt BJJ' };

  return {
    title: `${post.title} 수정 | Black Belt BJJ`,
    description: `"${post.title}" 게시글을 수정합니다.`,
    robots: { index: false },
  };
}

async function EditContent({ params }: Props) {
  const { slug } = await params;
  const id = extractPostId(slug);
  if (!id) notFound();

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
    redirect(buildPostUrl(post.title, id));
  }

  return <EditClient id={id} initialPost={post} />;
}

export default function EditPage({ params }: Props) {
  return <EditContent params={params} />;
}
