import AdminHeader from '@/components/admin/AdminHeader';
import AdminTableToolbar from '@/components/admin/AdminTableToolbar';
import { ADMIN_POST_FILTERS } from '@/constants/adminPostFilters';

export default function AdminPostPage() {
  return (
    <main className="w-full min-h-screen space-y-2">
      <AdminHeader page="post" />
      <AdminTableToolbar filters={ADMIN_POST_FILTERS} />
    </main>
  );
}
