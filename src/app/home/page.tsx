import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import BfcacheRefresher from '@/components/common/BfcacheRefresher';
import HomeLoggedInButtons from '@/components/home/HomeLoggedInButtons';

async function AuthButtons() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return <HomeLoggedInButtons />;
  }

  return (
    <div className="land-btns">
      <Link href="/dashboard" className="land-cta">
        시작하기
        <span className="land-cta-icon">→</span>
      </Link>
      <Link href="/login" className="land-login-solo">
        로그인
      </Link>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Activio | 스포츠인 올인원 네트워크',
  description: '스포츠인과 도장을 하나의 공간에서 연결하는 커뮤니티 플랫폼.',
};

const BG_IMAGES = [
  { src: '/images/activio-1.gif',  cls: 'home-bg-1' },
  { src: '/images/activio-2.jpg',  cls: 'home-bg-2' },
  { src: '/images/activio-3.webp', cls: 'home-bg-3' },
  { src: '/images/activio-4.jpg',  cls: 'home-bg-4' },
  { src: '/images/activio-5.jpeg', cls: 'home-bg-5' },
  { src: '/images/activio-6.jpg',  cls: 'home-bg-6' },
] as const;

export default function Home() {
  return (
    <main
      aria-label="Activio 홈"
      style={{
        minHeight: '100vh',
        background: '#111',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      <BfcacheRefresher />

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
      <div
        className="landing-inner"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '560px',
        }}
      >
        {/* Main heading */}
        <h1
          className="text-[28px] sm:text-[42px]"
          style={{
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.2,
            letterSpacing: '0.04em',
            marginBottom: '16px',
          }}
        >
          모든 스포츠인의
          <br />
          새로운 아지트
          <br />
          <em
            style={{
              fontStyle: 'normal',
              background: 'linear-gradient(135deg, #6e6e6e, #c8c8c8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.08em',
            }}
          >
            ACTIVIO
          </em>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7,
            marginBottom: '36px',
            fontWeight: 400,
          }}
        >
          커뮤니티 · 도장 찾기 · 대회 일정까지
          <br />
          대한민국 스포츠인을 위한 통합 플랫폼
        </p>

        {/* CTA buttons — 비로그인 시에만 표시 */}
        <Suspense fallback={<div style={{ height: '50px' }} />}>
          <AuthButtons />
        </Suspense>
      </div>

      {/* Inline styles for land-* classes */}
      <style>{`
        .land-btns {
          display: flex; gap: 12px; justify-content: center; align-items: center;
        }
        .land-cta {
          display: inline-flex; align-items: center; gap: 10px;
          height: 50px; padding: 0 28px;
          background: #2563eb;
          border-radius: 999px;
          font-size: 15px; font-weight: 700; color: #fff;
          box-shadow: 0 4px 20px rgba(37,99,235,0.5);
          transition: all 0.3s cubic-bezier(0.32,0.72,0,1);
        }
        .land-cta:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,0.6); }
        .land-cta-icon {
          width: 26px; height: 26px;
          background: rgba(255,255,255,0.22); border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0;
        }
        .land-login-solo {
          display: inline-flex; align-items: center; justify-content: center;
          height: 50px; padding: 0 28px;
          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.18);
          color: #fff; font-size: 15px; font-weight: 700;
          transition: all 0.3s;
        }
        .land-login-solo:hover {
          background: rgba(255,255,255,0.28);
          border-color: rgba(255,255,255,0.8);
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
}
