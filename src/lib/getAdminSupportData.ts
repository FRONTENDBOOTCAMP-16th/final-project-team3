import { SUPPORT_SECTION_FILTERS } from '@/components/admin/support/constants';
import type {
  SupportDojangQueryRow,
  SupportPostQueryRow,
  SupportProfileQueryRow,
  SupportReportQueryRow,
  SupportSection,
} from '@/components/admin/support/types';
import {
  mapDojangQueryRowsToAdminDojangVerificationRows,
  mapReportQueryRowsToAdminReportRows,
} from '@/components/admin/support/utils';
import {
  ADMIN_TABLE_PAGE_SIZE,
  buildAdminPaginationRange,
  parseAdminTableServerQuery,
  type AdminTableRouteSearchParams,
} from '@/lib/adminTableServerPagination';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const SUPPORT_SECTION_VALUES = SUPPORT_SECTION_FILTERS.map(
  (filter) => filter.value,
) as readonly SupportSection[];

type AdminSupportSearchParams = AdminTableRouteSearchParams & {
  section?: string | string[] | undefined;
};

type ReportStatusBucket = 'pending' | 'resolved' | 'ignored';

const REPORT_STATUS_BUCKETS = [
  'pending',
  'resolved',
  'ignored',
] as const satisfies readonly ReportStatusBucket[];

const EMPTY_SUPPORT_PROFILE_QUERY_RESULT: {
  data: SupportProfileQueryRow[];
  error: null;
} = {
  data: [],
  error: null,
};

const EMPTY_SUPPORT_POST_QUERY_RESULT: {
  data: SupportPostQueryRow[];
  error: null;
} = {
  data: [],
  error: null,
};

export interface AdminSupportPageData {
  dojangVerifications: ReturnType<
    typeof mapDojangQueryRowsToAdminDojangVerificationRows
  >;
  reports: ReturnType<typeof mapReportQueryRowsToAdminReportRows>;
  totalCount: number;
  pageSize: number;
}

function buildReportsCountQuery(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  matchingPostIds: string[],
  statusBucket: ReportStatusBucket,
) {
  let query = supabase.from('reports').select('id', {
    count: 'exact',
    head: true,
  });

  if (matchingPostIds.length > 0) {
    query = query.in('post_id', matchingPostIds);
  }

  if (statusBucket === 'pending') {
    return query.or('reports_status.eq.pending,reports_status.is.null');
  }

  return query.eq('reports_status', statusBucket);
}

function buildReportsDataQuery(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  matchingPostIds: string[],
  statusBucket: ReportStatusBucket,
) {
  let query = supabase
    .from('reports')
    .select(
      `
        id,
        reporter_id,
        post_id,
        reason,
        created_at,
        reports_status,
        handled_at,
        action_type
      `,
    )
    .order('created_at', { ascending: false });

  if (matchingPostIds.length > 0) {
    query = query.in('post_id', matchingPostIds);
  }

  if (statusBucket === 'pending') {
    return query.or('reports_status.eq.pending,reports_status.is.null');
  }

  return query.eq('reports_status', statusBucket);
}

function parseSupportQuery(searchParams: AdminSupportSearchParams) {
  return parseAdminTableServerQuery({
    searchParams,
    filterParamName: 'section',
    validFilters: SUPPORT_SECTION_VALUES,
    defaultFilter: 'dojang',
  });
}

async function getAdminDojangSupportData(
  searchParams: AdminSupportSearchParams,
): Promise<AdminSupportPageData> {
  const supabase = await createSupabaseServerClient();
  const { requestedPage, normalizedSearchQuery } =
    parseSupportQuery(searchParams);
  let matchingProfileIds: string[] = [];

  if (normalizedSearchQuery.length > 0) {
    const { data: matchingProfiles, error: matchingProfilesError } =
      await supabase
        .from('profiles')
        .select('id')
        .ilike('nickname', `%${normalizedSearchQuery}%`);

    if (matchingProfilesError) {
      throw new Error(matchingProfilesError.message);
    }

    matchingProfileIds = (matchingProfiles ?? []).map((profile) => profile.id);
  }

  let countQuery = supabase.from('dojang').select('id', {
    count: 'exact',
    head: true,
  });
  let dataQuery = supabase
    .from('dojang')
    .select(
      `
        id,
        profile_id,
        business_number,
        representative,
        phone_value,
        address,
        business_file_url,
        dojang_status,
        created_at,
        updated_at
      `,
    )
    .order('created_at', { ascending: false });

  if (normalizedSearchQuery.length > 0) {
    if (matchingProfileIds.length > 0) {
      const dojangSearchFilter = [
        `address.ilike.%${normalizedSearchQuery}%`,
        `profile_id.in.(${matchingProfileIds.join(',')})`,
      ].join(',');

      countQuery = countQuery.or(dojangSearchFilter);
      dataQuery = dataQuery.or(dojangSearchFilter);
    } else {
      countQuery = countQuery.ilike('address', `%${normalizedSearchQuery}%`);
      dataQuery = dataQuery.ilike('address', `%${normalizedSearchQuery}%`);
    }
  }

  const { count, error: dojangCountError } = await countQuery;

  if (dojangCountError) {
    throw new Error(dojangCountError.message);
  }

  const totalCount = count ?? 0;
  const { from, to, pageSize } = buildAdminPaginationRange({
    requestedPage,
    totalCount,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
  });

  const dojangResult = await dataQuery.range(from, to);

  if (dojangResult.error) {
    throw new Error(dojangResult.error.message);
  }

  const dojangs: SupportDojangQueryRow[] = dojangResult.data ?? [];
  const profileIds = Array.from(
    new Set(dojangs.map((dojang) => dojang.profile_id)),
  );
  const profilesResult =
    profileIds.length > 0
      ? await supabase
          .from('profiles')
          .select(
            `
            id,
            nickname,
            email_value
          `,
          )
          .in('id', profileIds)
      : EMPTY_SUPPORT_PROFILE_QUERY_RESULT;

  if (profilesResult.error) {
    throw new Error(profilesResult.error.message);
  }

  const profiles: SupportProfileQueryRow[] = profilesResult.data ?? [];

  return {
    dojangVerifications: mapDojangQueryRowsToAdminDojangVerificationRows(
      dojangs,
      profiles,
    ),
    reports: [],
    totalCount,
    pageSize,
  };
}

async function getAdminReportsSupportData(
  searchParams: AdminSupportSearchParams,
): Promise<AdminSupportPageData> {
  const supabase = await createSupabaseServerClient();
  const { requestedPage, normalizedSearchQuery } =
    parseSupportQuery(searchParams);
  let matchingPostIds: string[] = [];

  if (normalizedSearchQuery.length > 0) {
    const { data: matchingPosts, error: matchingPostsError } = await supabase
      .from('posts')
      .select('id')
      .ilike('title', `%${normalizedSearchQuery}%`);

    if (matchingPostsError) {
      throw new Error(matchingPostsError.message);
    }

    matchingPostIds = (matchingPosts ?? []).map((post) => post.id);
  }

  if (normalizedSearchQuery.length > 0 && matchingPostIds.length === 0) {
    return {
      dojangVerifications: [],
      reports: [],
      totalCount: 0,
      pageSize: ADMIN_TABLE_PAGE_SIZE,
    };
  }

  const reportStatusCounts = Object.fromEntries(
    await Promise.all(
      REPORT_STATUS_BUCKETS.map(async (statusBucket) => {
        const { count, error } = await buildReportsCountQuery(
          supabase,
          matchingPostIds,
          statusBucket,
        );

        if (error) {
          throw new Error(error.message);
        }

        return [statusBucket, count ?? 0] as const;
      }),
    ),
  ) as Record<ReportStatusBucket, number>;

  const totalCount = REPORT_STATUS_BUCKETS.reduce(
    (sum, statusBucket) => sum + reportStatusCounts[statusBucket],
    0,
  );
  const { from, to, pageSize } = buildAdminPaginationRange({
    requestedPage,
    totalCount,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
  });
  let remainingOffset = from;
  let remainingLimit = to - from + 1;
  const reports: SupportReportQueryRow[] = [];

  for (const statusBucket of REPORT_STATUS_BUCKETS) {
    const bucketCount = reportStatusCounts[statusBucket];

    if (remainingLimit <= 0) {
      break;
    }

    if (remainingOffset >= bucketCount) {
      remainingOffset -= bucketCount;
      continue;
    }

    const bucketFrom = remainingOffset;
    const bucketTo = Math.min(
      bucketCount - 1,
      bucketFrom + remainingLimit - 1,
    );
    const reportsResult = await buildReportsDataQuery(
      supabase,
      matchingPostIds,
      statusBucket,
    ).range(bucketFrom, bucketTo);

    if (reportsResult.error) {
      throw new Error(reportsResult.error.message);
    }

    reports.push(...(reportsResult.data ?? []));
    remainingLimit -= bucketTo - bucketFrom + 1;
    remainingOffset = 0;
  }

  const profileIds = Array.from(
    new Set(
      reports
        .map((report) => report.reporter_id)
        .filter((reporterId): reporterId is string => Boolean(reporterId)),
    ),
  );
  const postIds = Array.from(
    new Set(
      reports
        .map((report) => report.post_id)
        .filter((postId): postId is string => Boolean(postId)),
    ),
  );
  const [profilesResult, postsResult] = await Promise.all([
    profileIds.length > 0
      ? supabase
          .from('profiles')
          .select(
            `
            id,
            nickname,
            email_value
          `,
          )
          .in('id', profileIds)
      : Promise.resolve(EMPTY_SUPPORT_PROFILE_QUERY_RESULT),
    postIds.length > 0
      ? supabase
          .from('posts')
          .select(
            `
            id,
            title,
            status,
            deleted_at
          `,
          )
          .in('id', postIds)
      : Promise.resolve(EMPTY_SUPPORT_POST_QUERY_RESULT),
  ]);

  if (profilesResult.error) {
    throw new Error(profilesResult.error.message);
  }

  if (postsResult.error) {
    throw new Error(postsResult.error.message);
  }

  const profiles: SupportProfileQueryRow[] = profilesResult.data ?? [];
  const posts: SupportPostQueryRow[] = postsResult.data ?? [];

  return {
    dojangVerifications: [],
    reports: mapReportQueryRowsToAdminReportRows(
      reports,
      posts,
      profiles,
    ),
    totalCount,
    pageSize,
  };
}

export async function getAdminSupportData(
  searchParams: AdminSupportSearchParams,
): Promise<AdminSupportPageData> {
  const { activeFilter } = parseSupportQuery(searchParams);

  if (activeFilter === 'reports') {
    return getAdminReportsSupportData(searchParams);
  }

  return getAdminDojangSupportData(searchParams);
}
