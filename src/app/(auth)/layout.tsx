import Link from 'next/link';

const BG_IMAGES = [
  { src: '/images/activio-1.gif',  cls: 'home-bg-1' },
  { src: '/images/activio-2.jpg',  cls: 'home-bg-2' },
  { src: '/images/activio-3.webp', cls: 'home-bg-3' },
  { src: '/images/activio-4.jpg',  cls: 'home-bg-4' },
  { src: '/images/activio-5.jpeg', cls: 'home-bg-5' },
  { src: '/images/activio-6.jpg',  cls: 'home-bg-6' },
] as const;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-10 py-8"
      style={{ background: '#111', overflow: 'hidden' }}
    >
      {/* Slideshow backgrounds */}
      {BG_IMAGES.map(({ src, cls }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={cls}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(17,17,17,0.82) 0%, rgba(17,17,17,0.72) 40%, rgba(17,17,17,0.92) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center w-full" style={{ zIndex: 10 }}>
        <header>
          <Link
            href="/"
            className="flex flex-col items-center mb-6 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-focus focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
    </div>
  );
}
