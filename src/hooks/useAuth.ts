'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser, AuthUser } from '../lib/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 로컬 세션 먼저 확인 (빠름)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        getCurrentUser().then((u) => {
          setUser(u);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getCurrentUser().then(setUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/community');
  };

  return { user, loading, logout };
}
