'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

const navItems = [
  { label: '커뮤니티', href: '/community', icon: '/whitebelt.svg' },
  { label: '도장찾기', href: '/dojangs', icon: '/brownbelt.svg' },
  {
    label: '대회일정',
    href: '/competitions',
    icon: '/blackbeltcompetiton.svg',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 flex flex-col border-r w-50 h-screen bg-white border-gray-200"
      style={{ boxShadow: '4px 0 10px rgba(0,0,0,0.08)' }}
    >
      {/* 로고 */}
      <Link href="/">
        <div className="flex items-center justify-center py-6">
          <Image src="/blackbelt.svg" alt="black-belt" width={95} height={37} />
        </div>
      </Link>

      {/* 로고 아래 구분선 */}
      <div className="border-t border-gray-200" />

      {/* 네비게이션 */}
      <nav className="flex flex-col gap-1 px-3 py-3 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <Button
                className={`w-full h-12 justify-start gap-3 text-black bg-white hover:bg-gray-100
                  ${isActive ? 'bg-[#2c2c2c] text-white hover:bg-[#2c2c2c]' : ''}`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={44}
                  height={17}
                />
                <span className="text-[1rem]">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* 로그인 버튼 위 구분선 */}
      <div className="border-t border-gray-200" />

      {/* 로그인 버튼 */}
      <div className="px-3 py-4">
        <Link href="/login">
          <Button className="w-full h-12">로그인</Button>
        </Link>
      </div>
    </aside>
  );
}
