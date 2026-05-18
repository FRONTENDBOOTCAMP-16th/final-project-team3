import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { ROUTES } from '@/constants/routes';
import { sendReportNotificationEmail } from '@/lib/reportNotificationEmail';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { REPORT_REASONS, type ReportReason } from '@/services/reportService';

interface ReportRequestBody {
  postId?: string;
  commentId?: string;
  reason?: string;
}

interface ReportInsertPayload {
  reporter_id: string;
  reason: ReportReason;
  post_id?: string;
  comment_id?: string;
}

function isReportReason(value: string | undefined): value is ReportReason {
  return Boolean(value && REPORT_REASONS.includes(value as ReportReason));
}

function buildAbsoluteUrl(origin: string, path: string) {
  return new URL(path, origin).toString();
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  let body: ReportRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { postId, commentId, reason } = body;

  if (!postId && !commentId) {
    return NextResponse.json(
      { error: '신고 대상이 필요합니다.' },
      { status: 400 },
    );
  }

  if (!isReportReason(reason)) {
    return NextResponse.json(
      { error: '신고 사유가 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  let existingReportQuery = supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', user.id);

  if (commentId) {
    existingReportQuery = existingReportQuery.eq('comment_id', commentId);
  } else {
    existingReportQuery = existingReportQuery.eq('post_id', postId);
  }

  const { data: existingReport, error: existingReportError } =
    await existingReportQuery.maybeSingle();

  if (existingReportError) {
    return NextResponse.json(
      { error: '신고 중복 확인에 실패했습니다.' },
      { status: 500 },
    );
  }

  if (existingReport) {
    return NextResponse.json(
      { error: '이미 신고한 게시물입니다.', code: 'ALREADY_REPORTED' },
      { status: 409 },
    );
  }

  const payload: ReportInsertPayload = {
    reporter_id: user.id,
    reason,
  };

  if (postId) {
    payload.post_id = postId;
  }

  if (commentId) {
    payload.comment_id = commentId;
  }

  const { data: report, error: insertError } = await supabase
    .from('reports')
    .insert(payload)
    .select('id')
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: '신고 저장에 실패했습니다.' },
      { status: 500 },
    );
  }

  if (postId) {
    const { error: reportCountError } = await supabase.rpc(
      'increment_report_count',
      { post_id: postId },
    );

    if (reportCountError) {
      // eslint-disable-next-line no-console
      console.warn('Failed to increment report count:', reportCountError);
    }
  }

  const [postResult, reporterProfileResult] = await Promise.all([
    postId
      ? supabase.from('posts').select('title').eq('id', postId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from('profiles')
      .select('nickname, email_value')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  if (postResult.error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load reported post for email:', postResult.error);
  }

  if (reporterProfileResult.error) {
    // eslint-disable-next-line no-console
    console.warn(
      'Failed to load reporter profile for email:',
      reporterProfileResult.error,
    );
  }

  const postTitle = postResult.data?.title?.trim() || '삭제된 게시글';
  const reporterName =
    reporterProfileResult.data?.nickname?.trim() || user.email || '알 수 없음';
  const reporterEmail =
    reporterProfileResult.data?.email_value?.trim() || user.email || '-';
  const adminSupportUrl = buildAbsoluteUrl(
    req.nextUrl.origin,
    `${ROUTES.ADMIN_SUPPORT}?section=reports`,
  );
  const postUrl = postId
    ? buildAbsoluteUrl(req.nextUrl.origin, ROUTES.COMMUNITY_DETAIL(postId))
    : null;

  try {
    await sendReportNotificationEmail({
      reportId: report.id,
      postId: postId ?? null,
      postTitle,
      reason,
      reporterName,
      reporterEmail,
      adminSupportUrl,
      postUrl,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }

  revalidatePath(ROUTES.ADMIN_SUPPORT);

  return NextResponse.json({ reportId: report.id }, { status: 201 });
}
