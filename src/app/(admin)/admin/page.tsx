import AdminDashboardCards from '@/components/admin/dashboard/AdminDashboardCards';
import { getAdminDashboardData } from '@/lib/getAdminDashboardData';

export default async function AdminDashboardPage() {
  const dashboardData = await getAdminDashboardData();

  return <AdminDashboardCards data={dashboardData} />;
}
