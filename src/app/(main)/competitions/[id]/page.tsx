import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import {
  getCompetition,
  isPublicCompetitionVisible,
} from '@/services/competitionService';
import CompetitionDetailClient from '@/components/competition/CompetitionDetailClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const competition = await getCompetition(id);

  if (!isPublicCompetitionVisible(competition)) {
    return { title: '대회를 찾을 수 없습니다 | Black Belt BJJ' };
  }

  return {
    title: `${competition.name} | Black Belt BJJ`,
    description: competition.description ?? '주짓수 대회 상세 정보',
    openGraph: {
      title: `${competition.name} | Black Belt BJJ`,
      description: competition.description ?? '주짓수 대회 상세 정보',
      images: competition.image_url ? [{ url: competition.image_url }] : [],
    },
  };
}

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
  if (!isPublicCompetitionVisible(competition)) notFound();

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
