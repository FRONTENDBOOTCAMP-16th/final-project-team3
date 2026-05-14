import type { Metadata } from 'next';

import AdminDashboardCards from '@/components/admin/dashboard/AdminDashboardCards';
import { getAdminPageMetadata } from '@/constants/adminMeta';
import { getAdminDashboardData } from '@/lib/getAdminDashboardData';

export const metadata: Metadata = getAdminPageMetadata('dashboard');

export default async function AdminDashboardPage() {
  const dashboardData = await getAdminDashboardData();

  return <AdminDashboardCards data={dashboardData} />;
}
