import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');

  if (!nickname || nickname.length < 2) {
    return NextResponse.json(
      { error: '닉네임을 입력해주세요.' },
      { status: 400 },
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle();

  return NextResponse.json({ available: !data });
}
