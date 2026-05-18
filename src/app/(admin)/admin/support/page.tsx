import type { Metadata } from 'next';

import AdminSupportTableClient from '@/components/admin/support/AdminSupportTableClient';
import { getAdminPageMetadata } from '@/constants/adminMeta';
import {
  getAdminSupportData,
  type AdminSupportPageData,
} from '@/lib/getAdminSupportData';
import type { AdminTableRouteSearchParams } from '@/lib/adminTableServerPagination';

export const metadata: Metadata = getAdminPageMetadata('support');

type AdminSupportPageSearchParams = Promise<
  AdminTableRouteSearchParams & {
    section?: string | string[] | undefined;
  }
>;

interface AdminSupportPageProps {
  searchParams: AdminSupportPageSearchParams;
}

export default async function AdminSupportPage({
  searchParams,
}: AdminSupportPageProps) {
  const resolvedSearchParams = await searchParams;
  const data: AdminSupportPageData =
    await getAdminSupportData(resolvedSearchParams);

  return (
    <AdminSupportTableClient
      dojangVerifications={data.dojangVerifications}
      pageSize={data.pageSize}
      reports={data.reports}
      totalCount={data.totalCount}
    />
  );
}
