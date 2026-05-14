import CompetitionClient from '@/components/competition/CompetitionClient';
import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: '대회일정 | Black Belt BJJ',
  description: '전국 주짓수 대회 일정을 한눈에 확인하세요',
  openGraph: {
    title: '대회일정 | Black Belt BJJ',
    description: '전국 주짓수 대회 일정을 한눈에 확인하세요',
  },
};

export const dynamic = 'force-dynamic';

export default async function CompetitionsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: initialCompetitions } = await supabase
    .from('competition')
    .select('*') // comments(count) 제거
    .order('event_data', { ascending: true })
    .range(0, 9);

  return (
    <CompetitionClient
      initialCompetitions={
        initialCompetitions?.map((c) => ({
          ...c,
          comment_count: 0,
        })) ?? []
      }
    />
  );
}
