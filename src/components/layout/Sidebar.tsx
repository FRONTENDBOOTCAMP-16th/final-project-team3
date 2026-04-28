'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
  LogOut,
  LogIn,
  LayoutDashboard,
  FileText,
  Users,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: '커뮤니티', href: '/community', icon: '/whitebelt.svg' },
  { label: '도장찾기', href: '/dojangs', icon: '/brownbelt.svg' },
  {
    label: '대회일정',
    href: '/competitions',
    icon: '/blackbeltcompetiton.svg',
  },
];

const adminNavItems = [
  { label: '대시 보드', href: '/admin', icon: LayoutDashboard },
  { label: '게시글 관리', href: '/admin/posts', icon: FileText },
  { label: '유저 관리', href: '/admin/users', icon: Users },
  { label: '고객 지원', href: '/admin/support', icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    router.back();
  };

  return (
    <aside
      className="fixed left-0 top-0 flex flex-col border-r w-50 h-screen bg-bg-white border-gray-200"
      style={{ boxShadow: '4px 0 10px rgba(0,0,0,0.08)' }}
    >
      {/* 로고 */}
      <Link href="/">
        <div className="flex items-center justify-center py-6">
          <Image src="/blackbelt.svg" alt="black-belt" width={95} height={37} />
        </div>
      </Link>

      <div className="border-t border-gray-200" />

      {/* 공통 네비게이션 */}
      <nav className="flex flex-col gap-1 px-3 py-3 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <Button
                className={`w-full h-12 justify-start gap-3 bg-bg-white text-btn-text hover:bg-btn-basic
                  ${isActive ? 'bg-btn-focus text-btn-focus-text hover:bg-btn-focus' : ''}`}
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

      <div className="border-t border-gray-200" />

      {/* 푸터 */}
      <div className="px-3 py-4 flex flex-col gap-2">
        {/* 관리자 전용 섹션 */}
        {isAdmin && (
          <div className="flex flex-col gap-1 mb-2">
            {adminNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    className={`w-full h-12 justify-start gap-3 bg-bg-white text-btn-text hover:bg-btn-basic
                      ${isActive ? 'bg-btn-focus text-btn-focus-text hover:bg-btn-focus' : ''}`}
                  >
                    <Icon size={18} />
                    <span className="text-[1rem]">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        )}

        {/* 로그인 상태 분기 */}
        {loading ? (
          <div className="h-12" />
        ) : user ? (
          <div className="flex flex-col gap-2">
            <Link href="/mypage">
              <div className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-btn-basic transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-btn-basic flex items-center justify-center overflow-hidden shrink-0">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? '프로필 이미지'}
                      width={36}
                      height={36}
                    />
                  ) : (
                    <span className="text-sm font-medium text-btn-text">
                      {user.name?.[0] ?? '?'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {user.name ?? '이름 없음'}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {isAdmin ? 'Admin' : (user.belt ?? '')}
                  </span>
                </div>
              </div>
            </Link>
            <Button
              variant="ghost"
              className="w-full h-10 gap-2 text-text-secondary hover:text-text-primary"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              <span className="text-sm">로그아웃</span>
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button className="w-full h-12 gap-2 bg-btn-focus text-btn-focus-text">
              <LogIn size={16} />
              로그인
            </Button>
          </Link>
        )}
      </div>
    </aside>
  );
}
