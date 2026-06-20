import type { AppRole } from '@/types/role';

export type ContentUserRole = AppRole | string | null | undefined;

interface ContentPermissionParams {
  currentUserId: string | null | undefined;
  authorUserId: string | null | undefined;
  currentUserRole: ContentUserRole;
  authorRole: ContentUserRole;
}

export function canAdminManageAdminAuthoredContent(
  currentUserRole: ContentUserRole,
  authorRole: ContentUserRole,
) {
  return currentUserRole === 'admin' && authorRole === 'admin';
}

export function canManageContent({
  currentUserId,
  authorUserId,
  currentUserRole,
  authorRole,
}: ContentPermissionParams) {
  return (
    currentUserId === authorUserId ||
    canAdminManageAdminAuthoredContent(currentUserRole, authorRole)
  );
}
