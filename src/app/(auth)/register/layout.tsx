import Image from 'next/image';

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

      {/* 카드 — 로그인이랑 완전 동일 */}
      <div className="max-w-150 w-full bg-bg-white rounded-3xl p-8 shadow-sm border-none">
        {children}
      </div>
    </>
  );
}
