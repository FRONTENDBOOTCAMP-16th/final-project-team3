export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <p className="text-text-secondary text-sm font-medium text-center mb-6">
        새로운 계정을 만들어보세요
      </p>

      <div className="max-w-150 w-full bg-bg-white rounded-3xl p-8 shadow-sm border-none">
        {children}
      </div>
    </>
  );
}
