import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-bg-page px-10 py-6">
      {/* 로고 — 클릭 시 홈으로 이동 */}
      <Link href="/" className="flex flex-col items-center mb-6">
        <div className="relative w-40 h-20 mb-3">
          <Image
            src="/blackbelt.svg"
            alt="Black Belt Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </Link>

      {children}
    </div>
  );
}
