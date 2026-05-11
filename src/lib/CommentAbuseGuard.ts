// lib/CommentAbuseGuard.ts
// 댓글 어뷰징 방지 로직 — 서버 사이드 전용
//
// 사전 준비: Supabase 타입 생성 후 사용
//   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/types/database.types.ts

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/Database.types';

export const ABUSE_CONFIG = {
  /** 댓글 간 최소 대기 시간 (ms) */
  COOLTIME_MS: 10_000,
  /** 중복 체크할 최근 댓글 수 */
  DUPLICATE_CHECK_RANGE: 3,
  /** 연속 작성 최대 횟수 (초과 시 차단) */
  CONSECUTIVE_LIMIT: 3,
  /** 최소 글자 수 */
  MIN_LENGTH: 5,
  /** 최대 글자 수 */
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
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '') // 유니코드 invisible 문자 제거
    .replace(/\s+/g, ' ') // 연속 공백 → 단일 공백
    .trim()
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

  // 1. 길이 검사
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

  // 2. 병렬로 DB 조회 (쿨타임 / 중복 / 연속)
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

  // 3. 쿨타임 검사
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

  // 4. 중복 검사
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

  // 5. 연속 작성 검사
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
      message: `연속으로 ${ABUSE_CONFIG.CONSECUTIVE_LIMIT}회 이상 댓글을 작성할 수 없습니다.`,
    };
  }

  return { ok: true };
}
