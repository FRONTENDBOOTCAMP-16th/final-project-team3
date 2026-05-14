import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import CompetitionWriteClient from '@/components/competition/CompetitionWriteClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대회 추가 | Black Belt BJJ',
  description: '새로운 주짓수 대회 일정을 등록하세요',
};

async function CompetitionWriteContent() {
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

export default function CompetitionWritePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CompetitionWriteContent />
    </Suspense>
  );
}
