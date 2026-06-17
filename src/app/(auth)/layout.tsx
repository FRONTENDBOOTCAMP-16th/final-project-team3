import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-bg-page px-10 py-8">
      <header>
        <Link
          href="/"
          className="flex flex-col items-center mb-6 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
        >
          <div className="relative w-40 h-20 mb-1">
            <Image
              src="/blackbelt.svg"
              alt="Black Belt 홈"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </header>

      <main className="flex w-full flex-col items-center">{children}</main>
    </div>
  );
}
