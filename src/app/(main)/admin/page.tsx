import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboardCards from '@/components/admin/dashboard/AdminDashboardCards';
import { getAdminDashboardData } from '@/lib/getAdminDashboardData';

export default async function AdminDashboardPage() {
  const dashboardData = await getAdminDashboardData();

  return (
    <main className="min-h-screen w-full pt-28 space-y-8">
      <AdminHeader page="dashboard" />
      <AdminDashboardCards data={dashboardData} />
    </main>
  );
}
