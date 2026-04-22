import Sidebar from '@/src/components/layout/Sidebar/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
