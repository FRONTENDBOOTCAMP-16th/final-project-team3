import 'server-only';

import { revalidatePath, updateTag } from 'next/cache';

import { ROUTES } from '@/constants/routes';
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

export function revalidatePostCaches(
  postId: string,
  additionalPaths: string[] = [],
) {
  updateTag('posts-list');
  updateTag(`post-${postId}`);

  const paths = [
    ROUTES.COMMUNITY,
    ROUTES.COMMUNITY_DETAIL(postId),
    ...additionalPaths,
  ];

  for (const path of paths) {
    revalidatePath(path);
  }
}

export function revalidateCompetitionCaches(
  competitionId: string,
  additionalPaths: string[] = [],
) {
  updateTag('competitions');
  updateTag(`competition-${competitionId}`);

  const paths = [
    ROUTES.COMPETITIONS,
    ROUTES.COMPETITIONS_DETAIL(competitionId),
    ...additionalPaths,
  ];

  for (const path of paths) {
    revalidatePath(path);
  }
}
