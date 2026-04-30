import CompetitionClient from '@/components/competition/CompetitionClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
