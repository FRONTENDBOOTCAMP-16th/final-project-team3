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
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
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
