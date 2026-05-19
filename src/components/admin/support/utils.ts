import {
  UNKNOWN_DOJANG_NAME,
  UNKNOWN_EMAIL,
  UNKNOWN_POST_TITLE,
  UNKNOWN_REPORTER,
  UNKNOWN_REPORT_REASON,
  UNKNOWN_TEXT,
} from './constants';
import type {
  AdminDojangVerificationRow,
  AdminDojangVerificationStatus,
  AdminReportActionResult,
  AdminReportPostStatus,
  AdminReportProcessStatus,
  AdminReportRow,
  RawDojangStatus,
  RawReportActionType,
  RawReportStatus,
  SupportDojangQueryRow,
  SupportPostQueryRow,
  SupportProfileQueryRow,
  SupportReportQueryRow,
} from './types';

const REPORT_STATUS_PRIORITY_MAP: Record<string, number> = {
  pending: 0,
  resolved: 1,
  ignored: 2,
};

export function formatSupportDate(dateText: string | null | undefined) {
  return dateText ? dateText.slice(0, 10) : UNKNOWN_TEXT;
}

export function formatOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : UNKNOWN_TEXT;
}

export function formatDojangName(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : UNKNOWN_DOJANG_NAME;
}

export function formatEmail(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : UNKNOWN_EMAIL;
}

export function getDojangStatusLabel(
  dojangStatus: RawDojangStatus,
): AdminDojangVerificationStatus {
  if (dojangStatus === 'approved') {
    return '승인완료';
  }

  if (dojangStatus === 'rejected') {
    return '승인거부';
  }

  return '검토중';
}

export function getReportStatusLabel(
  reportStatus: RawReportStatus,
): AdminReportProcessStatus {
  if (reportStatus === 'resolved') {
    return '처리완료';
  }

  if (reportStatus === 'ignored') {
    return '문제없음';
  }

  return '처리중';
}

export function getReportActionLabel(
  actionType: RawReportActionType,
): AdminReportActionResult {
  if (actionType === 'hide_post') {
    return '게시글 숨김';
  }

  if (actionType === 'delete_post') {
    return '게시글 삭제';
  }

  return '조치 없음';
}

export function getReportActionResultLabel(
  reportStatus: RawReportStatus,
  actionType: RawReportActionType,
): AdminReportActionResult {
  if (reportStatus === 'pending' || reportStatus === null) {
    return '-';
  }

  return getReportActionLabel(actionType);
}

export function getReportPostStatusLabel(
  postStatus: string | null | undefined,
  postDeletedAt: string | null | undefined,
): AdminReportPostStatus {
  if (postDeletedAt) {
    return '삭제';
  }

  if (postStatus === 'hidden') {
    return '숨김';
  }

  return '게시중';
}

function buildProfilesMap(profiles: SupportProfileQueryRow[]) {
  return new Map(profiles.map((profile) => [profile.id, profile] as const));
}

function buildPostsMap(posts: SupportPostQueryRow[]) {
  return new Map(posts.map((post) => [post.id, post] as const));
}

export function mapDojangQueryRowsToAdminDojangVerificationRows(
  dojangs: SupportDojangQueryRow[],
  profiles: SupportProfileQueryRow[],
) {
  const profilesMap = buildProfilesMap(profiles);

  return dojangs.map<AdminDojangVerificationRow>((dojang) => {
    const profile = profilesMap.get(dojang.profile_id);

    return {
      id: dojang.id,
      profile_id: dojang.profile_id,
      dojang_name: formatDojangName(profile?.nickname),
      representative: formatOptionalText(dojang.representative),
      phone: formatOptionalText(dojang.phone_value),
      email: formatEmail(profile?.email_value),
      address: formatOptionalText(dojang.address),
      requested_at: formatSupportDate(dojang.created_at),
      status: getDojangStatusLabel(dojang.dojang_status),
      raw_status: dojang.dojang_status,
      business_number: formatOptionalText(dojang.business_number),
      business_file_url: dojang.business_file_url,
      updated_at: formatSupportDate(dojang.updated_at),
    };
  });
}

export function mapReportQueryRowsToAdminReportRows(
  reports: SupportReportQueryRow[],
  posts: SupportPostQueryRow[],
  profiles: SupportProfileQueryRow[],
) {
  const postsMap = buildPostsMap(posts);
  const profilesMap = buildProfilesMap(profiles);

  return reports.map<AdminReportRow>((report) => {
    const post = report.post_id ? postsMap.get(report.post_id) : null;
    const isMissingPost = Boolean(report.post_id) && !post;
    const reporter = report.reporter_id
      ? profilesMap.get(report.reporter_id)
      : null;

    return {
      id: report.id,
      post_id: report.post_id,
      post_title: post?.title?.trim() || UNKNOWN_POST_TITLE,
      reason: report.reason?.trim() || UNKNOWN_REPORT_REASON,
      reporter: reporter?.nickname?.trim() || UNKNOWN_REPORTER,
      reported_at: formatSupportDate(report.created_at),
      process_status: getReportStatusLabel(report.reports_status),
      action_result: getReportActionResultLabel(
        report.reports_status,
        report.action_type,
      ),
      handled_at: formatSupportDate(report.handled_at),
      raw_status: report.reports_status,
      raw_action_type: report.action_type,
      post_status_label: isMissingPost
        ? '삭제'
        : getReportPostStatusLabel(post?.status, post?.deleted_at),
      post_status: post?.status ?? null,
      post_deleted_at: post?.deleted_at ?? null,
    };
  });
}

export function sortSupportReportQueryRows(reports: SupportReportQueryRow[]) {
  return [...reports].sort((left, right) => {
    const leftPriority =
      REPORT_STATUS_PRIORITY_MAP[left.reports_status ?? ''] ??
      Number.MAX_SAFE_INTEGER;
    const rightPriority =
      REPORT_STATUS_PRIORITY_MAP[right.reports_status ?? ''] ??
      Number.MAX_SAFE_INTEGER;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return (
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );
  });
}

export function filterDojangVerifications(
  rows: AdminDojangVerificationRow[],
  searchQuery: string,
) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return rows.filter((row) => {
    if (normalizedSearchQuery.length === 0) {
      return true;
    }

    return (
      row.dojang_name.toLowerCase().includes(normalizedSearchQuery) ||
      row.address.toLowerCase().includes(normalizedSearchQuery)
    );
  });
}

export function filterReports(rows: AdminReportRow[], searchQuery: string) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return rows.filter((row) => {
    if (normalizedSearchQuery.length === 0) {
      return true;
    }

    return row.post_title.toLowerCase().includes(normalizedSearchQuery);
  });
}
