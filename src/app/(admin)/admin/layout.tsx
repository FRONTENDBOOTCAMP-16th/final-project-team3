import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ScrollToTop from '@/components/common/ScrollToTop';
import Sidebar from '@/components/layout/Sidebar';
import { ADMIN_LAYOUT_METADATA } from '@/constants/adminMeta';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = ADMIN_LAYOUT_METADATA;

async function requireAdminAccess() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) notFound();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile.role !== 'admin') notFound();
}

async function AdminContent({ children }: { children: React.ReactNode }) {
  await requireAdminAccess();

  return (
    <div className="flex min-h-screen bg-bg-page">
      <div className="w-50 shrink-0" />
      <Sidebar />
      <AdminHeader />
      <main className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-7xl pt-28">{children}</div>
      </main>
      <ScrollToTop />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}
