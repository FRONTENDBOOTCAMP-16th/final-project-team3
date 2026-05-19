import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  MIN_NICKNAME_LENGTH,
  NICKNAME_MIN_LENGTH_MESSAGE,
} from '@/constants/user';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname')?.trim();
  const excludeUserId = searchParams.get('excludeUserId');

  if (!nickname || nickname.length < MIN_NICKNAME_LENGTH) {
    return NextResponse.json(
      { error: NICKNAME_MIN_LENGTH_MESSAGE },
      { status: 400 },
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('nickname', nickname);

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ available: !data });
}
