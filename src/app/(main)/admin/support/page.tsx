import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminSupportTableClient from '@/components/admin/support/AdminSupportTableClient';
import type {
  SupportSection,
  SupportDojangQueryRow,
  SupportPostQueryRow,
  SupportProfileQueryRow,
  SupportReportQueryRow,
} from '@/components/admin/support/types';
import {
  mapDojangQueryRowsToAdminDojangVerificationRows,
  mapReportQueryRowsToAdminReportRows,
  sortSupportReportQueryRows,
} from '@/components/admin/support/utils';

async function getAdminSupportData() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );

  const [dojangResult, reportsResult] = await Promise.all([
    supabase
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
      .order('created_at', { ascending: false }),
    supabase
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
      .order('created_at', { ascending: false }),
  ]);

  if (dojangResult.error) {
    throw new Error(dojangResult.error.message);
  }

  if (reportsResult.error) {
    throw new Error(reportsResult.error.message);
  }

  const dojangs = (dojangResult.data ?? []) as SupportDojangQueryRow[];
  const reports = sortSupportReportQueryRows(
    (reportsResult.data ?? []) as SupportReportQueryRow[],
  );

  const profileIds = Array.from(
    new Set([
      ...dojangs.map((dojang) => dojang.profile_id),
      ...reports
        .map((report) => report.reporter_id)
        .filter((reporterId): reporterId is string => Boolean(reporterId)),
    ]),
  );

  const postIds = Array.from(
    new Set(
      reports
        .map((report) => report.post_id)
        .filter((postId): postId is string => Boolean(postId)),
    ),
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
      : { data: [] as SupportProfileQueryRow[], error: null };

  const postsResult =
    postIds.length > 0
      ? await supabase
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
      : { data: [] as SupportPostQueryRow[], error: null };

  if (profilesResult.error) {
    throw new Error(profilesResult.error.message);
  }

  if (postsResult.error) {
    throw new Error(postsResult.error.message);
  }

  const profiles = (profilesResult.data ?? []) as SupportProfileQueryRow[];
  const posts = (postsResult.data ?? []) as SupportPostQueryRow[];

  return {
    dojangVerifications: mapDojangQueryRowsToAdminDojangVerificationRows(
      dojangs,
      profiles,
    ),
    reports: mapReportQueryRowsToAdminReportRows(reports, posts, profiles),
  };
}

function getInitialSupportSection(
  sectionParam: string | string[] | undefined,
): SupportSection {
  const section = Array.isArray(sectionParam) ? sectionParam[0] : sectionParam;

  return section === 'reports' ? 'reports' : 'dojang';
}

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const data = await getAdminSupportData();
  const initialSection = getInitialSupportSection(resolvedSearchParams.section);

  return (
    <main className="min-h-screen w-full pt-28 space-y-2">
      <AdminHeader page="support" />
      <AdminSupportTableClient
        dojangVerifications={data.dojangVerifications}
        reports={data.reports}
        initialSection={initialSection}
      />
    </main>
  );
}
