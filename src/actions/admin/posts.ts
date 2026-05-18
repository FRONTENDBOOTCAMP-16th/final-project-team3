'use server';

import type { AdminPostStatus } from '@/components/admin/posts/types';
import { ROUTES } from '@/constants/routes';

import {
  actionResponse,
  revalidatePostCaches,
  requireAdminSupabaseForAction,
  type AdminActionResult,
} from './_shared';

interface ToggleAdminPostVisibilityParams {
  postId: string;
  currentStatus: AdminPostStatus;
}

interface AdminPostMutationPayload {
  deleted_at?: string | null;
  status?: AdminPostStatus;
}

interface ActionMessages {
  success: string;
  failure: string;
}

interface UpdateAdminPostParams {
  postId: string;
  payload: AdminPostMutationPayload;
  messages: ActionMessages;
}

const DELETE_POST_MESSAGES: ActionMessages = {
  success: '게시글을 삭제했습니다.',
  failure: '게시글 삭제에 실패했습니다.',
};

const RESTORE_POST_MESSAGES: ActionMessages = {
  success: '게시글을 복구했습니다.',
  failure: '게시글 복구에 실패했습니다.',
};

async function updateAdminPost({
  postId,
  payload,
  messages,
}: UpdateAdminPostParams): Promise<AdminActionResult> {
  const authResult = await requireAdminSupabaseForAction();

  if (!authResult.ok) {
    return authResult.result;
  }

  const { data, error } = await authResult.supabase
    .from('posts')
    .update(payload)
    .eq('id', postId)
    .select('id')
    .maybeSingle();

  if (error) {
    return actionResponse.failure(messages.failure);
  }

  if (!data) {
    return actionResponse.failure('게시글을 찾을 수 없습니다.');
  }

  revalidatePostCaches(postId, [ROUTES.ADMIN_POSTS]);

  return actionResponse.success(messages.success);
}

export async function toggleAdminPostVisibility({
  postId,
  currentStatus,
}: ToggleAdminPostVisibilityParams): Promise<AdminActionResult> {
  const nextStatus: AdminPostStatus =
    currentStatus === 'hidden' ? 'published' : 'hidden';

  const visibilityMessages: ActionMessages =
    nextStatus === 'hidden'
      ? {
          success: '게시글을 숨김 처리했습니다.',
          failure: '게시글 숨김 처리에 실패했습니다.',
        }
      : {
          success: '게시글 숨김을 해제했습니다.',
          failure: '게시글 숨김 해제에 실패했습니다.',
        };

  return updateAdminPost({
    postId,
    payload: {
      status: nextStatus,
    },
    messages: visibilityMessages,
  });
}

export async function deleteAdminPost(
  postId: string,
): Promise<AdminActionResult> {
  return updateAdminPost({
    postId,
    payload: {
      deleted_at: new Date().toISOString(),
    },
    messages: DELETE_POST_MESSAGES,
  });
}

export async function restoreAdminPost(
  postId: string,
): Promise<AdminActionResult> {
  return updateAdminPost({
    postId,
    payload: {
      deleted_at: null,
      status: 'published',
    },
    messages: RESTORE_POST_MESSAGES,
  });
}
