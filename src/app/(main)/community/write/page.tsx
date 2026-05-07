// 서버 컴포넌트
import WriteClient from '@/components/community/WriteClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export default async function WritePage() {
  const user = await getUser();

  // 서버에서 미인증 차단 — 클라이언트 useEffect 불필요
  if (!user) redirect('/login');

  return <WriteClient />;
}
