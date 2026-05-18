import { notFound } from 'next/navigation';
import {
  getCompetition,
  isPublicCompetitionVisible,
} from '@/services/competitionService.server';
import CompetitionDetailClient from '@/components/competition/CompetitionDetailClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { extractCompetitionId } from '@/lib/slug';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = extractCompetitionId(slug);
  if (!id) return { title: '대회를 찾을 수 없습니다 | Black Belt BJJ' };

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

async function CompetitionDetailContent({ params }: Props) {
  const { slug } = await params;
  const id = extractCompetitionId(slug);
  if (!id) notFound();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentUserRole = user?.id
    ? ((
        await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
      ).data?.role ?? null)
    : null;

  const competition = await getCompetition(id);
  if (!isPublicCompetitionVisible(competition)) notFound();

  return (
    <CompetitionDetailClient
      competition={competition}
      userId={user?.id ?? null}
      currentUserRole={currentUserRole}
    />
  );
}

export default function CompetitionDetailPage({ params }: Props) {
  return <CompetitionDetailContent params={params} />;
}
