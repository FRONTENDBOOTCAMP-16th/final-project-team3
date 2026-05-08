// app/(main)/competitions/write/page.tsx (서버 컴포넌트)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CompetitionWriteClient from '@/components/competition/CompetitionWriteClient';

export default async function CompetitionWritePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 프로필에서 role 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'manager') {
    redirect('/competitions');
  }

  return <CompetitionWriteClient userId={user.id} />;
}
