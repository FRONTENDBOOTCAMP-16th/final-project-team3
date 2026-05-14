import type { Metadata } from 'next';

import AdminUsersClient from '@/components/admin/users/AdminUsersClient';
import type {
  DojangQueryRow,
  ProfileQueryRow,
} from '@/components/admin/users/types';
import { mapProfilesToAdminUserRows } from '@/components/admin/users/utils';
import { getAdminPageMetadata } from '@/constants/adminMeta';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = getAdminPageMetadata('users');

async function getAdminUsers() {
  const supabase = await createSupabaseServerClient();

  const [profilesResult, dojangsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select(
        `
        id,
        nickname,
        avatar_url,
        bio,
        belt_level,
        created_at,
        role,
        email_value,
        name,
        account_status
      `,
      )
      .order('created_at', { ascending: false }),
    supabase.from('dojang').select(
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
    ),
  ]);

  if (profilesResult.error) {
    throw new Error(profilesResult.error.message);
  }

  if (dojangsResult.error) {
    throw new Error(dojangsResult.error.message);
  }

  return mapProfilesToAdminUserRows(
    (profilesResult.data ?? []) as ProfileQueryRow[],
    (dojangsResult.data ?? []) as DojangQueryRow[],
  );
}

export default async function AdminUsersPage() {
  const data = await getAdminUsers();

  return <AdminUsersClient data={data} />;
}
