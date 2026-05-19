import type { ReportReason } from '@/services/reportService';

interface SendReportNotificationEmailOptions {
  reportId: string;
  postId: string | null;
  postTitle: string;
  reason: ReportReason;
  reporterName: string;
  reporterEmail: string;
  adminSupportUrl: string;
  postUrl: string | null;
}

const RESEND_EMAIL_API_URL = 'https://api.resend.com/emails';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildReportNotificationHtml({
  reportId,
  postId,
  postTitle,
  reason,
  reporterName,
  reporterEmail,
  adminSupportUrl,
  postUrl,
}: SendReportNotificationEmailOptions) {
  const rows = [
    ['신고 ID', reportId],
    ['게시글 ID', postId ?? '-'],
    ['게시글 제목', postTitle],
    ['신고 사유', reason],
    ['신고자', reporterName],
    ['신고자 이메일', reporterEmail],
  ];

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <th style="width:120px;padding:10px 12px;text-align:left;background:#f4f4f5;border:1px solid #e4e4e7;">${escapeHtml(label)}</th>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#18181b;">
      <h2 style="margin:0 0 16px;">새 게시글 신고가 접수되었습니다</h2>
      <p style="margin:0 0 20px;color:#52525b;">관리자 페이지에서 신고 내용을 확인하고 처리해주세요.</p>
      <table style="border-collapse:collapse;width:100%;max-width:680px;margin-bottom:20px;font-size:14px;">
        <tbody>${detailRows}</tbody>
      </table>
      <p style="margin:0 0 12px;">
        <a href="${escapeHtml(adminSupportUrl)}" style="display:inline-block;padding:10px 14px;border-radius:6px;background:#18181b;color:#ffffff;text-decoration:none;">신고내역 확인하기</a>
      </p>
      ${
        postUrl
          ? `<p style="margin:0;color:#71717a;font-size:13px;">게시글 링크: <a href="${escapeHtml(postUrl)}">${escapeHtml(postUrl)}</a></p>`
          : ''
      }
    </div>
  `;
}

export async function sendReportNotificationEmail(
  options: SendReportNotificationEmailOptions,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_REPORT_EMAIL;
  const from = process.env.REPORT_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    return;
  }

  const response = await fetch(RESEND_EMAIL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[Black Belt] 새 신고 접수: ${options.postTitle}`,
      html: buildReportNotificationHtml(options),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Report notification email failed: ${response.status} ${errorText}`,
    );
  }
}
