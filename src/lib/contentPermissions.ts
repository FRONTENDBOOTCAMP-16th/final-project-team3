import type { AppRole } from '@/types/role';

export type ContentUserRole = AppRole | string | null | undefined;

interface ContentPermissionParams {
  currentUserId: string | null | undefined;
  authorUserId: string | null | undefined;
  currentUserRole: ContentUserRole;
  authorRole: ContentUserRole;
}

export function canManageContent({
  currentUserId,
  authorUserId,
  currentUserRole,
}: ContentPermissionParams) {
  return currentUserRole === 'admin' || currentUserId === authorUserId;
}
