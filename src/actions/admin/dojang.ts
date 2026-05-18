'use server';

import { revalidatePath, updateTag } from 'next/cache';

import { ROUTES } from '@/constants/routes';

import {
  actionResponse,
  requireAdminSupabaseForAction,
  type AdminActionResult,
} from './_shared';

interface UpdateAdminDojangStatusParams {
  dojangId: string;
  nextStatus: 'pending' | 'approved' | 'rejected';
}

function getDojangStatusMessages(nextStatus: UpdateAdminDojangStatusParams['nextStatus']) {
  if (nextStatus === 'approved') {
    return {
      success: '도장 인증 요청을 승인했습니다.',
      failure: '도장 승인에 실패했습니다.',
    };
  }

  if (nextStatus === 'rejected') {
    return {
      success: '도장 인증 요청을 거부했습니다.',
      failure: '도장 거부 처리에 실패했습니다.',
    };
  }

  return {
    success: '도장 인증 상태를 검토중으로 변경했습니다.',
    failure: '도장 상태 변경에 실패했습니다.',
  };
}

function revalidateAdminDojangPaths() {
  updateTag('dojangs');
  revalidatePath(ROUTES.ADMIN);
  revalidatePath(ROUTES.ADMIN_SUPPORT);
  revalidatePath(ROUTES.ADMIN_USERS);
  revalidatePath(ROUTES.DOJANGS);
}

export async function updateAdminDojangStatus({
  dojangId,
  nextStatus,
}: UpdateAdminDojangStatusParams): Promise<AdminActionResult> {
  const authResult = await requireAdminSupabaseForAction();

  if (!authResult.ok) {
    return authResult.result;
  }

  const messages = getDojangStatusMessages(nextStatus);
  const { data, error } = await authResult.supabase
    .from('dojang')
    .update({ dojang_status: nextStatus })
    .eq('id', dojangId)
    .select('id')
    .maybeSingle();

  if (error) {
    return actionResponse.failure(messages.failure);
  }

  if (!data) {
    return actionResponse.failure('도장 인증 요청을 찾을 수 없습니다.');
  }

  revalidateAdminDojangPaths();

  return actionResponse.success(messages.success);
}
