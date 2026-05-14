import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCompetition } from '@/services/competitionService';
import CompetitionEditClient from '@/components/competition/CompetitionEditClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const competition = await getCompetition(id);

  return {
    title: `${competition?.name ?? '대회'} 수정 | Black Belt BJJ`,
    description: `${competition?.name ?? '대회'} 정보를 수정합니다`,
  };
}

async function CompetitionEditContent({ params }: Props) {
  const { id } = await params;
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

  const competition = await getCompetition(id);
  if (!competition) notFound();

  return <CompetitionEditClient competition={competition} />;
}

export default function CompetitionEditPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CompetitionEditContent params={params} />
    </Suspense>
  );
}
