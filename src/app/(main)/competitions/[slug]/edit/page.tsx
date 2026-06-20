import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import CompetitionEditClient from '@/components/competition/CompetitionEditClient';
import { canManageContent } from '@/lib/contentPermissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCompetition } from '@/services/competitionService.server';
import { extractCompetitionId, buildCompetitionUrl } from '@/lib/slug';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = extractCompetitionId(slug);
  if (!id) return { title: '대회를 찾을 수 없습니다 | Activio' };

  const competition = await getCompetition(id);
  return {
    title: `${competition?.name ?? '대회'} 수정 | Activio`,
    description: `${competition?.name ?? '대회'} 정보를 수정합니다`,
  };
}

async function CompetitionEditContent({ params }: Props) {
  const { slug } = await params;
  const id = extractCompetitionId(slug);
  if (!id) notFound();

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

  const competition = await getCompetition(id);
  if (!competition) notFound();

  if (
    !canManageContent({
      currentUserId: user.id,
      authorUserId: competition.user_id,
      currentUserRole: profile?.role ?? null,
      authorRole: competition.role,
    })
  ) {
    redirect(buildCompetitionUrl(competition.name, id));
  }

  return <CompetitionEditClient competition={competition} />;
}

export default function CompetitionEditPage({ params }: Props) {
  return <CompetitionEditContent params={params} />;
}
