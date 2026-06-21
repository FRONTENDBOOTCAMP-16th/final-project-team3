export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <p
        className="text-center mb-6"
        style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.01em' }}
      >
        새로운 계정을 만들어보세요
      </p>

      <div className="max-w-150 w-full bg-bg-surface rounded-3xl p-8 shadow-sm border-none">
        {children}
      </div>
    </>
  );
}
