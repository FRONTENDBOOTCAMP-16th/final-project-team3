import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// app/api/posts/[id]/route.ts
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

  const { title, content, image_url } = await req.json(); // 허용 필드만 구조분해

  const { error } = await supabase
    .from('posts')
    .update({ title, content, image_url })
    .eq('id', id)
    .eq('user_id', user.id);

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

  // 권한 체크
  const { data: post } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', id)
    .single();

  if (post?.user_id !== user.id)
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });

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
