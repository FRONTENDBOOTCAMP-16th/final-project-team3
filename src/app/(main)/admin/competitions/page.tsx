import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminCompetitionsClient from '@/components/admin/competitions/AdminCompetitionsClient';

// async function getAdminCompetitions() {
//   const cookieStore = await cookies();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//       },
//     },
//   );

//   const { data, error } = await supabase
//     .from('competitions')
//     .select(
//       `
//       id,
//       category,
//       title,
//       status,
//       deleted_at,
//       view_count,
//       report_count,
//       created_at,
//       profiles (
//         nickname
//       )
//     `,
//     )
//     .order('created_at', { ascending: false });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return mapPostQueryRowsToAdminPostRows((data ?? []) as PostQueryRow[]);
// }

export default function AdminCompetitionsPage() {
  // const data = await getAdminCompetitions();

  return (
    <main className="min-h-screen w-full pt-28 space-y-2">
      <AdminHeader page="competitions" />
      {/* <AdminCompetitionsClient data={data} /> */}
    </main>
  );
}
