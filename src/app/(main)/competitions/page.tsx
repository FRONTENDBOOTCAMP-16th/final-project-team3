import CompetitionClient from '@/components/competition/CompetitionClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

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

  const { data: initialCompetitions } = await supabase
    .from('competition')
    .select('*')
    .order('event_data', { ascending: true });

  return <CompetitionClient initialCompetitions={initialCompetitions ?? []} />;
}
