import { supabase } from '@/lib/supabase';

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
  reporter_id: string;
  reason: ReportReason;
  post_id?: string;
  comment_id?: string;
}

export async function reportPost(
  reporterId: string,
  postId: string,
  reason: ReportReason,
) {
  const { data: existing } = await supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', reporterId)
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    throw new Error('ALREADY_REPORTED');
  }

  const payload: ReportPayload = {
    reporter_id: reporterId,
    post_id: postId,
    reason,
  };

  const { error } = await supabase.from('reports').insert(payload);
  if (error) throw error;

  await supabase.rpc('increment_report_count', { post_id: postId });
}

export async function reportComment(
  reporterId: string,
  commentId: string,
  postId: string,
  reason: ReportReason,
) {
  const { data: existing } = await supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', reporterId)
    .eq('comment_id', commentId)
    .maybeSingle();

  if (existing) {
    throw new Error('ALREADY_REPORTED');
  }

  const payload: ReportPayload = {
    reporter_id: reporterId,
    comment_id: commentId,
    post_id: postId,
    reason,
  };

  const { error } = await supabase.from('reports').insert(payload);
  if (error) throw error;
}
