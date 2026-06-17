'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function HomeLoggedInButtons() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="land-btns">
      <Link href="/dashboard" className="land-cta">
        시작하기
        <span className="land-cta-icon">→</span>
      </Link>
      <button type="button" onClick={handleLogout} className="land-login-solo">
        로그아웃
      </button>
    </div>
  );
}
