// src/hooks/useUserRole.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data) setUserRole(data.role);
    };
    fetchUserRole();
  }, []);

  return userRole;
}
