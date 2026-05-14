import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/Database.types';
import { checkCommentAbuse } from '@/lib/CommentAbuseGuard';

async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();

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
    if (insertError.message.includes('COOLTIME')) {
      const match = insertError.message.match(/(\d+)/);
      const remain = match ? match[1] : '잠시';
      return NextResponse.json(
        {
          error: `${remain}초 후에 다시 작성할 수 있습니다.`,
          code: 'COOLTIME',
        },
        { status: 429 },
      );
    }
    console.error('[comments] insert error:', insertError);
    return NextResponse.json(
      { error: '댓글 저장에 실패했습니다.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ comment }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer();
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
