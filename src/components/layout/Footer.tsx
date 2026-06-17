'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: '대시보드', href: '/dashboard' },
  { label: '커뮤니티', href: '/community' },
  { label: '대회일정', href: '/competitions' },
  { label: '도장찾기', href: '/dojangs' },
  { label: '마이페이지', href: '/mypage' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/home') return null;

  return (
    <footer
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 'auto',
      }}
    >
      <div
        className="footer-content"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 20px 0',
        }}
      >
        <div
          className="footer-columns"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '32px',
          }}
        >
          {/* Brand */}
          <div style={{ flex: '0 0 auto' }}>
            <Link
              href="/home"
              style={{
                fontWeight: 800,
                fontSize: '16px',
                letterSpacing: '0.08em',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            >
              ACTIVIO
            </Link>
            <p
              style={{
                fontSize: '12.5px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: '1.7',
                maxWidth: '220px',
              }}
            >
              스포츠인과 도장을<br />
              하나의 공간에서 연결하는<br />
              올인원 커뮤니티 플랫폼
            </p>
          </div>

          {/* Nav + Platform — 모바일: 좌우 2열, 데스크탑: 각각 독립 flex 항목 */}
          <div className="footer-bottom-row">
            {/* Nav links */}
            <nav aria-label="푸터 내비게이션">
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  marginBottom: '14px',
                }}
              >
                메뉴
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.55)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Platform info */}
            <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  marginBottom: '14px',
                }}
              >
                플랫폼
              </p>
              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.9' }}>
                Next.js · Supabase<br />
                Tailwind CSS · TypeScript<br />
                Naver Maps API
              </p>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            marginTop: '36px',
            padding: '18px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.25)' }}>
            © 2025 Activio. All rights reserved.
          </p>
          <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.2)' }}>
            프론트엔드 부트캠프 16기 Team 3
          </p>
        </div>
      </div>
    </footer>
  );
}
