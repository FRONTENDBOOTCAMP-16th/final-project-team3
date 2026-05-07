import EditClient from '@/components/community/EditClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getPost } from '@/services/communityService';
import { notFound, redirect } from 'next/navigation';

async function getInitialData(id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );

  const [
    post,
    {
      data: { user },
    },
  ] = await Promise.all([getPost(id), supabase.auth.getUser()]);

  if (!user) redirect('/login');
  if (!post) notFound();

  // 본인 게시글만 수정 가능
  if (post.user_id !== user.id) redirect(`/community/${id}`);

  return { post };
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { post } = await getInitialData(id);

  return <EditClient id={id} initialPost={post} />;
}
