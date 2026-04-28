import { supabase } from './supabase';

export type UserRole = 'user' | 'manager' | 'pending' | 'admin';

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
  belt?: string;
  image?: string;
} | null;

export async function getCurrentUser(): Promise<AuthUser> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role, belt_level, avatar_url')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    name: profile.name,
    role: profile.role,
    belt: profile.belt_level,
    image: profile.avatar_url,
  };
}
