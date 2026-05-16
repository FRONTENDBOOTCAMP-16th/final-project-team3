import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

type Props = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  const { content } = await req.json();
  if (!content) {
    return NextResponse.json(
      { error: 'content는 필수입니다.' },
      { status: 400 },
    );
  }

  // 권한 체크
  const { data: comment } = await supabase
    .from('comments')
    .select('user_id, post_id')
    .eq('id', id)
    .single();

  if (comment?.user_id !== user.id) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const { error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: '댓글 수정에 실패했습니다.' },
      { status: 500 },
    );
  }

  revalidateTag(`comments-${comment.post_id}`, 'max');
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  // 권한 체크
  const { data: comment } = await supabase
    .from('comments')
    .select('user_id, post_id')
    .eq('id', id)
    .single();

  if (comment?.user_id !== user.id) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const { error } = await supabase
    .from('comments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: '댓글 삭제에 실패했습니다.' },
      { status: 500 },
    );
  }

  revalidateTag(`comments-${comment.post_id}`, 'max');
  return NextResponse.json({ success: true });
}
