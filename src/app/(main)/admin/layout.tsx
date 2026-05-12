import { notFound } from 'next/navigation';

import AdminHeader from '@/components/admin/AdminHeader';
import { createServerSupabaseClient } from '@/lib/createServerSupabaseClient';

async function requireAdminAccess() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    notFound();
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile.role !== 'admin') {
    notFound();
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminAccess();

  return (
    <div className="min-h-screen w-full pt-28">
      <AdminHeader />
      <div className="mt-2">{children}</div>
    </div>
  );
}
