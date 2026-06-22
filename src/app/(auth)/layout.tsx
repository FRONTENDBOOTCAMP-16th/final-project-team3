import Image from 'next/image';
import Link from 'next/link';
import { BG_IMAGES } from '@/constants/bgImages';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-10 py-8"
      style={{ background: 'var(--color-bg-page)', overflow: 'hidden' }}
    >
      {/* Slideshow backgrounds — fixed to viewport so size stays constant regardless of content height */}
      {BG_IMAGES.map(({ src, cls }, idx) => (
        <div
          key={src}
          className={cls}
          style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
        >
          <Image
            fill
            src={src}
            alt=""
            aria-hidden="true"
            style={{ objectFit: 'cover' }}
            priority={idx === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Scrim overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(var(--color-scrim-rgb),0.82) 0%, rgba(var(--color-scrim-rgb),0.72) 40%, rgba(var(--color-scrim-rgb),0.92) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center w-full" style={{ zIndex: 10 }}>
        <header>
          <Link
            href="/"
            className="flex flex-col items-center mb-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-focus focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <span
              style={{
                fontSize: '52px',
                fontWeight: 900,
                letterSpacing: '0.1em',
                background: 'linear-gradient(135deg, var(--color-brand-grad-start) 0%, var(--color-brand-grad-mid) 60%, var(--color-brand-grad-end) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                lineHeight: 1,
              }}
            >
              ACTIVIO
            </span>
          </Link>
        </header>

        <main className="flex w-full flex-col items-center">{children}</main>
      </div>
    </div>
  );
}
