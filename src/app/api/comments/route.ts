import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';
import { checkCommentAbuse } from '@/lib/CommentAbuseGuard';

export async function POST(req: NextRequest) {
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

  let body: { postId?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { postId, content } = body;
  if (!postId || !content) {
    return NextResponse.json(
      { error: 'postId와 content는 필수입니다.' },
      { status: 400 },
    );
  }

  const check = await checkCommentAbuse({
    supabase,
    userId: user.id,
    postId,
    content,
  });

  if (!check.ok) {
    return NextResponse.json(
      { error: check.message, code: check.code },
      { status: 429 },
    );
  }

  const { data: comment, error: insertError } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: user.id, content: content.trim() })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: '댓글 저장에 실패했습니다.' },
      { status: 500 },
    );
  }

  revalidateTag(`comments-${postId}`, 'max');
  return NextResponse.json({ comment }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const postId = req.nextUrl.searchParams.get('postId');

  if (!postId) {
    return NextResponse.json(
      { error: 'postId가 필요합니다.' },
      { status: 400 },
    );
  }

  const { data: comments, error } = await supabase
    .from('comments')
    .select('id, content, created_at, user_id')
    .eq('post_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      { error: '조회에 실패했습니다.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ comments });
}
