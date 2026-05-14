import 'server-only';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AdminActionResult = {
  success: boolean;
  message: string;
};

export const actionResponse = {
  success: (message: string): AdminActionResult => ({
    success: true,
    message,
  }),

  failure: (message: string): AdminActionResult => ({
    success: false,
    message,
  }),
};

export async function requireAdminSupabaseForAction() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false as const,
      result: actionResponse.failure('로그인이 필요합니다.'),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return {
      ok: false as const,
      result: actionResponse.failure('관리자 권한이 필요합니다.'),
    };
  }

  return {
    ok: true as const,
    supabase,
  };
}
