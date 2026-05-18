'use server';

import { revalidatePath } from 'next/cache';

import type { RawAccountStatus } from '@/components/admin/users/types';
import { ROUTES } from '@/constants/routes';

import {
  actionResponse,
  requireAdminSupabaseForAction,
  type AdminActionResult,
} from './_shared';

function getNextAccountStatus(accountStatus: RawAccountStatus) {
  return accountStatus !== 'inactive' && accountStatus !== 'suspended'
    ? 'suspended'
    : 'active';
}

export async function toggleAdminUserAccountStatus(
  userId: string,
): Promise<AdminActionResult> {
  const authResult = await requireAdminSupabaseForAction();

  if (!authResult.ok) {
    return authResult.result;
  }

  const { data: userProfile, error: profileError } = await authResult.supabase
    .from('profiles')
    .select('account_status, nickname')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    return actionResponse.failure('계정 정보를 불러오지 못했습니다.');
  }

  if (!userProfile) {
    return actionResponse.failure('사용자를 찾을 수 없습니다.');
  }

  const nextAccountStatus = getNextAccountStatus(userProfile.account_status);
  const { error: updateError } = await authResult.supabase
    .from('profiles')
    .update({ account_status: nextAccountStatus })
    .eq('id', userId);

  if (updateError) {
    return actionResponse.failure('계정 상태 변경에 실패했습니다.');
  }

  revalidatePath(ROUTES.ADMIN_USERS);

  const normalizedNickname = userProfile.nickname?.trim() || '사용자';
  const nextAccountLabel =
    nextAccountStatus === 'active' ? '활성' : '비활성';

  return actionResponse.success(
    `${normalizedNickname} 계정을 ${nextAccountLabel} 상태로 변경했습니다.`,
  );
}
