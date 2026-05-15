import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-bg-white px-10 py-6">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Link href="/" className="flex flex-col items-center mb-2">
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
