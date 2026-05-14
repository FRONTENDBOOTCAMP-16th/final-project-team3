import { redirect } from 'next/navigation';
import CompetitionWriteClient from '@/components/competition/CompetitionWriteClient';
import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: '대회 추가 | Black Belt BJJ',
  description: '새로운 주짓수 대회 일정을 등록하세요',
};

export const dynamic = 'force-dynamic';

export default async function CompetitionWritePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

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
