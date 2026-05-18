import { Suspense } from 'react';
import CompetitionClient from '@/components/competition/CompetitionClient';
import { supabasePublic } from '@/lib/supabase/public';
import { cacheTag, cacheLife } from 'next/cache';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대회일정 | Black Belt BJJ',
  description: '전국 주짓수 대회 일정을 한눈에 확인하세요',
  openGraph: {
    title: '대회일정 | Black Belt BJJ',
    description: '전국 주짓수 대회 일정을 한눈에 확인하세요',
  },
};

async function getCompetitions() {
  'use cache';
  cacheTag('competitions');
  cacheLife('hours');

  const { data } = await supabasePublic
    .from('competition')
    .select('*')
    .is('deleted_at', null)
    .order('event_data', { ascending: true })
    .range(0, 9);

  return data?.map((c) => ({ ...c, comment_count: 0 })) ?? [];
}

async function CompetitionsContent() {
  const initialCompetitions = await getCompetitions();
  return <CompetitionClient initialCompetitions={initialCompetitions} />;
}

export default function CompetitionsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CompetitionsContent />
    </Suspense>
  );
}
