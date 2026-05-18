export type ReportReason =
  | '스팸 또는 광고'
  | '욕설 및 혐오 발언'
  | '음란물 또는 불건전한 내용'
  | '개인정보 침해'
  | '허위 정보'
  | '기타';

export const REPORT_REASONS: ReportReason[] = [
  '스팸 또는 광고',
  '욕설 및 혐오 발언',
  '음란물 또는 불건전한 내용',
  '개인정보 침해',
  '허위 정보',
  '기타',
];

interface ReportPayload {
  reason: ReportReason;
  post_id?: string;
  comment_id?: string;
}

async function createReport(payload: ReportPayload) {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postId: payload.post_id,
      commentId: payload.comment_id,
      reason: payload.reason,
    }),
  });

  if (response.status === 409) {
    throw new Error('ALREADY_REPORTED');
  }

  if (!response.ok) {
    throw new Error('REPORT_FAILED');
  }
}

export async function reportPost(
  _reporterId: string,
  postId: string,
  reason: ReportReason,
) {
  const payload: ReportPayload = {
    post_id: postId,
    reason,
  };

  await createReport(payload);
}

export async function reportComment(
  _reporterId: string,
  commentId: string,
  postId: string,
  reason: ReportReason,
) {
  const payload: ReportPayload = {
    comment_id: commentId,
    post_id: postId,
    reason,
  };

  await createReport(payload);
}
