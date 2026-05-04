import AdminHeader from '@/components/admin/AdminHeader';

export default function Page() {
  return (
    <main className="min-h-screen w-full pt-28 space-y-2">
      <AdminHeader page="competitions" />
      {/* <AdminPostTableClient data={postData} /> */}
    </main>
  );
}
