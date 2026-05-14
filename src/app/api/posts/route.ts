import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from('posts')
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag('posts-list', 'max');
  return NextResponse.json({ post: data });
}
