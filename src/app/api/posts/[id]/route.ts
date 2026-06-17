import { createSupabaseServerClient } from '@/lib/supabase/server';
import { canManageContent } from '@/lib/contentPermissions';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

interface PostPermissionRow {
  user_id: string | null;
  profiles: { role: string | null } | { role: string | null }[] | null;
}

function getAuthorRole(post: PostPermissionRow) {
  return post.profiles && !Array.isArray(post.profiles)
    ? post.profiles.role
    : null;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });

  const { title, content, image_url, video_url } = await req.json();

  const [{ data: profile }, { data: post, error: postError }] =
    await Promise.all([
      supabase.from('profiles').select('role').eq('id', user.id).single(),
      supabase
        .from('posts')
        .select('user_id, profiles(role)')
        .eq('id', id)
        .maybeSingle(),
    ]);

  if (postError)
    return NextResponse.json({ error: postError.message }, { status: 500 });

  if (!post)
    return NextResponse.json(
      { error: '게시글을 찾을 수 없습니다.' },
      { status: 404 },
    );

  const authorRole = getAuthorRole(post as PostPermissionRow);

  if (
    !canManageContent({
      currentUserId: user.id,
      authorUserId: post.user_id,
      currentUserRole: profile?.role ?? null,
      authorRole,
    })
  ) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const { error } = await supabase
    .from('posts')
    .update({ title, content, image_url, video_url })
    .eq('id', id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag('posts-list', 'max');
  revalidateTag(`post-${id}`, 'max');
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });

  const [{ data: profile }, { data: post, error: postError }] =
    await Promise.all([
      supabase.from('profiles').select('role').eq('id', user.id).single(),
      supabase
        .from('posts')
        .select('user_id, profiles(role)')
        .eq('id', id)
        .maybeSingle(),
    ]);

  if (postError)
    return NextResponse.json({ error: postError.message }, { status: 500 });

  if (!post)
    return NextResponse.json(
      { error: '게시글을 찾을 수 없습니다.' },
      { status: 404 },
    );

  const authorRole = getAuthorRole(post as PostPermissionRow);

  if (
    !canManageContent({
      currentUserId: user.id,
      authorUserId: post.user_id,
      currentUserRole: profile?.role ?? null,
      authorRole,
    })
  ) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const { error } = await supabase
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag('posts-list', 'max');
  revalidateTag(`post-${id}`, 'max');
  return NextResponse.json({ success: true });
}
