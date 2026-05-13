'use server';

import { revalidatePath } from 'next/cache';

import { ROUTES } from '@/constants/routes';

import {
  actionResponse,
  requireAdminSupabaseForAction,
  type AdminActionResult,
} from './_shared';

function revalidateAdminCompetitionPaths(competitionId: string) {
  revalidatePath(ROUTES.ADMIN_COMPETITIONS);
  revalidatePath(ROUTES.COMPETITIONS);
  revalidatePath(ROUTES.COMPETITIONS_DETAIL(competitionId));
}

export async function restoreAdminCompetition(
  competitionId: string,
): Promise<AdminActionResult> {
  const authResult = await requireAdminSupabaseForAction();

  if (!authResult.ok) {
    return authResult.result;
  }

  const { data, error } = await authResult.supabase
    .from('competition')
    .update({ deleted_at: null })
    .eq('id', competitionId)
    .select('id')
    .maybeSingle();

  if (error) {
    return actionResponse.failure('대회 게시글 복구에 실패했습니다.');
  }

  if (!data) {
    return actionResponse.failure('대회 게시글을 찾을 수 없습니다.');
  }

  revalidateAdminCompetitionPaths(competitionId);

  return actionResponse.success('대회 게시글을 복구했습니다.');
}
