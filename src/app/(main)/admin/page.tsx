import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import AdminHeader from '@/components/admin/AdminHeader';

// async function getAdminDashboard() {
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
// }

export default function AdminDashboardtPage() {
  // const postData = await getAdminDashboard();

  return (
    <main className="w-full min-h-screen space-y-2">
      <AdminHeader page="dashboard" />
    </main>
  );
}
