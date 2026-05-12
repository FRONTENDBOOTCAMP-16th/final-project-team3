import AdminCompetitionsClient from '@/components/admin/competitions/AdminCompetitionsClient';
import type { CompetitionQueryRow } from '@/components/admin/competitions/types';
import { mapCompetitionQueryRowsToAdminCompetitionRows } from '@/components/admin/competitions/utils';
import { createServerSupabaseClient } from '@/lib/createServerSupabaseClient';

async function getAdminCompetitions() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('competition')
    .select(
      `
      id,
      name,
      location,
      event_data,
      apply_deadline,
      created_at,
      apply_url
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return mapCompetitionQueryRowsToAdminCompetitionRows(
    (data ?? []) as CompetitionQueryRow[],
  );
}

export default async function AdminCompetitionsPage() {
  const data = await getAdminCompetitions();

  return <AdminCompetitionsClient data={data} />;
}
