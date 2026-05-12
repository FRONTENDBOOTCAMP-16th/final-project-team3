import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, password, checkOnly } = await req.json();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email_value', email)
    .eq('name', name)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: '이름 또는 이메일이 올바르지 않습니다.' },
      { status: 404 },
    );
  }

  if (checkOnly) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: '비밀번호 재설정에 실패했습니다.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
