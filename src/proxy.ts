import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from './lib/supabase/server';

export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const supabase = await createSupabaseServerClient();

  // 세션 갱신 (getSession() 쓰면 안 됨!)
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
