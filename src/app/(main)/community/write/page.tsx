// community/write/page.tsx
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import WriteClient from '@/components/community/WriteClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '게시글 작성',
  description: '블랙벨트 커뮤니티에 새 게시글을 작성합니다.',
  robots: { index: false }, // 작성 페이지는 검색엔진 색인 제외
};

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export default async function WritePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  return <WriteClient />;
}
