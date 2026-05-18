import type { Metadata } from 'next';
import WriteClient from '@/components/community/WriteClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '게시글 작성 | Black Belt BJJ',
  description: '블랙벨트 커뮤니티에 새 게시글을 작성합니다.',
  robots: { index: false },
};

async function WriteContent() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return <WriteClient />;
}

export default function WritePage() {
  return <WriteContent />;
}
