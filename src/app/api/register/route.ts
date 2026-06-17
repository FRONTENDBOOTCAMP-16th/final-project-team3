import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { SPORTS } from '@/constants/sports';

const SPORT_SLUGS = SPORTS.map((s) => s.slug);

export async function POST(req: NextRequest) {
  const { email, password, name, nickname, belt } = await req.json();
  const sport = belt;

  if (!sport || !SPORT_SLUGS.includes(sport)) {
    return NextResponse.json(
      { error: '운동 종목을 선택해주세요.' },
      { status: 400 },
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: data.user.id,
    name,
    nickname,
    belt_level: sport,
    email_value: email,
    role: 'user',
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
