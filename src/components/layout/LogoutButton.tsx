'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINK_CLASS =
  'flex items-center gap-2 px-6 py-3 border-2 border-btn-focus text-black text-sm font-medium rounded-xl hover:bg-btn-focus hover:text-white transition-colors duration-200';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button type="button" className={NAV_LINK_CLASS} onClick={() => logout()}>
      <LogOut size={20} aria-hidden="true" />
      <span>로그아웃</span>
    </button>
  );
}
