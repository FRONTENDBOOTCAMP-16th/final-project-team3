'use server';

import { revalidatePath } from 'next/cache';

import { ROUTES } from '@/constants/routes';

import {
  actionResponse,
  revalidatePostCaches,
  requireAdminSupabaseForAction,
  type AdminActionResult,
} from './_shared';

export type AdminReportProcessActionType = 'hide_post' | 'delete_post' | 'none';

interface ProcessAdminReportParams {
  reportId: string;
  postId: string | null;
  actionType: AdminReportProcessActionType;
}

export async function processAdminReport({
  reportId,
  postId,
  actionType,
}: ProcessAdminReportParams): Promise<AdminActionResult> {
  const authResult = await requireAdminSupabaseForAction();

  if (!authResult.ok) {
    return authResult.result;
  }

  const { supabase } = authResult;

  if ((actionType === 'hide_post' || actionType === 'delete_post') && !postId) {
    return actionResponse.failure('연결된 게시글 정보를 찾을 수 없습니다.');
  }

  if (actionType === 'hide_post' && postId) {
    const { data, error } = await supabase
      .from('posts')
      .update({ status: 'hidden' })
      .eq('id', postId)
      .select('id')
      .maybeSingle();

    if (error) {
      return actionResponse.failure('게시글 숨김 처리에 실패했습니다.');
    }

    if (!data) {
      return actionResponse.failure('게시글을 찾을 수 없습니다.');
    }
  }

  if (actionType === 'delete_post' && postId) {
    const { data, error } = await supabase
      .from('posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', postId)
      .select('id')
      .maybeSingle();

    if (error) {
      return actionResponse.failure('게시글 삭제 처리에 실패했습니다.');
    }

    if (!data) {
      return actionResponse.failure('게시글을 찾을 수 없습니다.');
    }
  }

  const nextReportStatus = actionType === 'none' ? 'ignored' : 'resolved';

  const { data: report, error: reportError } = await supabase
    .from('reports')
    .update({
      reports_status: nextReportStatus,
      action_type: actionType,
      handled_at: new Date().toISOString(),
    })
    .eq('id', reportId)
    .select('id')
    .maybeSingle();

  if (reportError) {
    return actionResponse.failure('신고 처리 상태 저장에 실패했습니다.');
  }

  if (!report) {
    return actionResponse.failure('신고 내역을 찾을 수 없습니다.');
  }

  if (postId) {
    revalidatePostCaches(postId, [ROUTES.ADMIN_POSTS, ROUTES.ADMIN_SUPPORT]);
  } else {
    revalidatePath(ROUTES.ADMIN_SUPPORT);
  }

  if (actionType === 'hide_post') {
    return actionResponse.success('신고 내역을 게시글 숨김으로 처리했습니다.');
  }

  if (actionType === 'delete_post') {
    return actionResponse.success('신고 내역을 게시글 삭제로 처리했습니다.');
  }

  return actionResponse.success('신고 내역을 문제없음으로 처리했습니다.');
}
