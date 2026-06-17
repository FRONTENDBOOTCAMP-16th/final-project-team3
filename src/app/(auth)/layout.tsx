import Link from 'next/link';

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
          <span
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, #6e6e6e, #c8c8c8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
            }}
          >
            ACTIVIO
          </span>
        </Link>
      </header>

      <main className="flex w-full flex-col items-center">{children}</main>
    </div>
  );
}
