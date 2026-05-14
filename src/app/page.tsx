import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/layout/LogoutButton';
import { LogIn } from 'lucide-react';

export const metadata: Metadata = {
  title: '블랙벨트 | 주짓수 올인원 네트워크',
  description:
    '주짓수 수련자와 도장을 하나의 공간에서 연결하는 커뮤니티 플랫폼.',
  keywords: ['주짓수', '블랙벨트', '도장', '커뮤니티', 'BJJ'],
  openGraph: {
    title: '블랙벨트 | 주짓수 올인원 네트워크',
    description: '주짓수인들을 위한 올인원 네트워크, 블랙벨트',
    locale: 'ko_KR',
    type: 'website',
  },
};

const NAV_LINKS = [
  { href: '/community', icon: '/whitebelt.svg', label: '커뮤니티' },
  { href: '/dojangs', icon: '/brownbelt.svg', label: '도장 찾기' },
  {
    href: '/competitions',
    icon: '/blackbeltcompetiton.svg',
    label: '대회 일정',
  },
] as const;

const NAV_LINK_CLASS =
  'flex items-center gap-2 px-6 py-3 border-2 border-btn-focus text-black text-sm font-medium rounded-xl hover:bg-btn-focus hover:text-white transition-colors duration-200';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main
      aria-label="블랙벨트 홈"
      className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
    >
      <div className="flex flex-col items-center mb-6 animate-fade-in">
        <div className="mb-4">
          <Image
            src="/blackbelt.svg"
            alt="블랙벨트 로고"
            width={170}
            height={170}
          />
        </div>

        <h1
          className="text-4xl font-black tracking-tight text-black text-center leading-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          블랙벨트
        </h1>
        <p
          className="text-lg font-light tracking-[0.3em] text-gray-500 mt-1"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          (Black-Belt)
        </p>

        <p className="text-sm text-gray-600 text-center max-w-xl leading-relaxed mt-4">
          주짓수인들을 위한 올인원 네트워크, 블랙벨트
          <br />
          <br />
          블랙벨트(Black-Belt) 플랫폼은 주짓수 수련자와 도장을
          <br />
          하나의 공간에서 연결하는 커뮤니티 서비스입니다.
          <br />
          사용자는 기술 공유, 매칭 요청, 수련 경험을 기록할 수 있으며,
          <br />
          도장은 공지 및 홍보를 통해 수련자들과 직접 소통할 수 있는 커뮤니티
          플랫폼입니다.
        </p>
      </div>

      <nav aria-label="주요 메뉴">
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {NAV_LINKS.map(({ href, icon, label }) => (
            <Link key={href} href={href} className={NAV_LINK_CLASS}>
              <Image
                src={icon}
                alt=""
                width={35}
                height={35}
                aria-hidden="true"
              />
              <span>{label}</span>
            </Link>
          ))}

          {user ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className={NAV_LINK_CLASS}>
              <LogIn size={20} aria-hidden="true" />
              <span>로그인</span>
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
