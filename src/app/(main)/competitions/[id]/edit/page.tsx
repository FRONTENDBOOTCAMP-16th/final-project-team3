import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { canManageContent } from '@/lib/contentPermissions';
import { notFound, redirect } from 'next/navigation';
import { getCompetition } from '@/services/competitionService';
import CompetitionEditClient from '@/components/competition/CompetitionEditClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const competition = await getCompetition(id);

  return {
    title: `${competition?.name ?? '대회'} 수정 | Black Belt BJJ`,
    description: `${competition?.name ?? '대회'} 정보를 수정합니다`,
  };
}

export default async function CompetitionEditPage({
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
    redirect(`/competitions/${id}`);
  }

  return <CompetitionEditClient competition={competition} />;
}
