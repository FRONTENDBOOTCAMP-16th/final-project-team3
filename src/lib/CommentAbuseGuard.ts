import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/Database.types';

export const ABUSE_CONFIG = {
  COOLTIME_MS: 10_000,

  DUPLICATE_CHECK_RANGE: 3,

  CONSECUTIVE_LIMIT: 2,

  MIN_LENGTH: 5,

  MAX_LENGTH: 1000,
} as const;

export type AbuseCheckResult =
  | { ok: true }
  | { ok: false; code: AbuseErrorCode; message: string };

export type AbuseErrorCode =
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'COOLTIME'
  | 'DUPLICATE'
  | 'CONSECUTIVE_LIMIT';

function normalize(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
    .replace(/\s/g, '')
    .toLowerCase();
}

export async function checkCommentAbuse(params: {
  supabase: SupabaseClient<Database>;
  userId: string;
  postId: string;
  content: string;
}): Promise<AbuseCheckResult> {
  const { supabase, userId, postId, content } = params;
  const trimmed = content.trim();

  if (trimmed.length < ABUSE_CONFIG.MIN_LENGTH) {
    return {
      ok: false,
      code: 'TOO_SHORT',
      message: `댓글은 최소 ${ABUSE_CONFIG.MIN_LENGTH}자 이상 입력해주세요.`,
    };
  }
  if (trimmed.length > ABUSE_CONFIG.MAX_LENGTH) {
    return {
      ok: false,
      code: 'TOO_LONG',
      message: `댓글은 ${ABUSE_CONFIG.MAX_LENGTH}자를 초과할 수 없습니다.`,
    };
  }

  const [lastTimeResult, recentContentResult, recentCommentersResult] =
    await Promise.all([
      supabase.rpc('get_last_comment_time', { p_user_id: userId }),
      supabase.rpc('get_recent_comments_content', {
        p_user_id: userId,
        p_post_id: postId,
        p_limit: ABUSE_CONFIG.DUPLICATE_CHECK_RANGE,
      }),
      supabase.rpc('get_recent_commenters', {
        p_post_id: postId,
        p_limit: ABUSE_CONFIG.CONSECUTIVE_LIMIT,
      }),
    ]);

  const lastTime = lastTimeResult.data;
  if (lastTime) {
    const elapsed = Date.now() - new Date(lastTime as string).getTime();
    if (elapsed < ABUSE_CONFIG.COOLTIME_MS) {
      const remainSec = Math.ceil((ABUSE_CONFIG.COOLTIME_MS - elapsed) / 1000);
      return {
        ok: false,
        code: 'COOLTIME',
        message: `${remainSec}초 후에 다시 작성할 수 있습니다.`,
      };
    }
  }

  type ContentRow =
    Database['public']['Functions']['get_recent_comments_content']['Returns'][number];
  const recentContents = (recentContentResult.data ?? []) as ContentRow[];
  const normalizedInput = normalize(trimmed);
  if (
    recentContents.some((row) => normalize(row.content) === normalizedInput)
  ) {
    return {
      ok: false,
      code: 'DUPLICATE',
      message: `최근 ${ABUSE_CONFIG.DUPLICATE_CHECK_RANGE}개 댓글과 동일한 내용입니다.`,
    };
  }

  type CommenterRow =
    Database['public']['Functions']['get_recent_commenters']['Returns'][number];
  const recentCommenters = (recentCommentersResult.data ??
    []) as CommenterRow[];
  if (
    recentCommenters.length >= ABUSE_CONFIG.CONSECUTIVE_LIMIT &&
    recentCommenters.every((row) => row.user_id === userId)
  ) {
    return {
      ok: false,
      code: 'CONSECUTIVE_LIMIT',
      message: `연속으로 ${ABUSE_CONFIG.CONSECUTIVE_LIMIT + 1}회 이상 댓글을 작성할 수 없습니다.`,
    };
  }

  return { ok: true };
}
