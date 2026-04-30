import Image from 'next/image';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 로고 — 로그인이랑 완전 동일 */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-40 h-20 mb-3">
          <Image
            src="/blackbelt.svg"
            alt="Black Belt Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-text-secondary text-sm font-medium text-center">
          새로운 계정을 만들어보세요
        </p>
      </div>

      {/* 카드 — 로그인이랑 완전 동일 */}
      <div className="max-w-150 w-full bg-bg-white rounded-3xl p-8 shadow-sm border-none">
        {children}
      </div>
    </>
  );
}
