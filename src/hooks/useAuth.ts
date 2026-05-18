'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { getCurrentUser, AuthUser } from '../lib/auth';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
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

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        getCurrentUser().then(setUser);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const logout = async () => {
    queryClient.clear();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/community';
  };

  return { user, loading, logout };
}
