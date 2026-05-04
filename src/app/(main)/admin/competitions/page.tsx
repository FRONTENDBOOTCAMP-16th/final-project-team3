import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminCompetitionsClient from '@/components/admin/competitions/AdminCompetitionsClient';
import type { CompetitionQueryRow } from '@/components/admin/competitions/types';
import { mapCompetitionQueryRowsToAdminCompetitionRows } from '@/components/admin/competitions/utils';

async function getAdminCompetitions() {
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

  return (
    <main className="min-h-screen w-full pt-28 space-y-2">
      <AdminHeader page="competitions" />
      <AdminCompetitionsClient data={data} />
    </main>
  );
}
