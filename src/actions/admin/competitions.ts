'use server';

import {
  actionResponse,
  revalidateCompetitionCaches,
  requireAdminSupabaseForAction,
  type AdminActionResult,
} from './_shared';
import { ROUTES } from '@/constants/routes';

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

  revalidateCompetitionCaches(competitionId, [ROUTES.ADMIN_COMPETITIONS]);

  return actionResponse.success('대회 게시글을 복구했습니다.');
}
