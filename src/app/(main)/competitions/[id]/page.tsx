// app/(main)/competitions/[id]/page.tsx (서버 컴포넌트)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCompetition } from '@/services/competitionService';
import CompetitionDetailClient from '@/components/competition/CompetitionDetailClient';

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const competition = await getCompetition(id);
  if (!competition) notFound();

  // 조회수 증가
  await supabase
    .from('competition')
    .update({ view_count: (competition.view_count ?? 0) + 1 })
    .eq('id', id);

  return (
    <CompetitionDetailClient
      competition={competition}
      userId={user?.id ?? null}
    />
  );
}
