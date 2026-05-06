import {
  UNKNOWN_USER_EMAIL,
  UNKNOWN_USER_NAME,
  UNKNOWN_USER_NICKNAME,
} from './constants';
import type {
  AdminAccountStatus,
  AdminDojangApprovalStatus,
  AdminUserFilterValue,
  AdminUserRow,
  AdminUserType,
  DojangQueryRow,
  ProfileQueryRow,
  RawAccountStatus,
  RawDojangStatus,
  RawUserRole,
} from './types';

const DOJANG_ROLE_SET = new Set(['manager', 'dojang', 'pending']);

export function formatUserDate(dateText: string) {
  return dateText.slice(0, 10);
}

export function formatOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : UNKNOWN_USER_NAME;
}

export function formatNickname(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : UNKNOWN_USER_NICKNAME;
}

export function formatEmail(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : UNKNOWN_USER_EMAIL;
}

export function getUserType(role: RawUserRole): AdminUserType {
  if (role === 'admin') {
    return '관리자';
  }

  if (typeof role === 'string' && DOJANG_ROLE_SET.has(role)) {
    return '도장';
  }

  return '일반';
}

export function isUserActive(accountStatus: RawAccountStatus) {
  return accountStatus !== 'inactive' && accountStatus !== 'suspended';
}

export function getAccountStatusLabel(
  accountStatus: RawAccountStatus,
): AdminAccountStatus {
  return isUserActive(accountStatus) ? '활성' : '비활성';
}

export function getNextAccountStatus(accountStatus: RawAccountStatus) {
  return isUserActive(accountStatus) ? 'suspended' : 'active';
}

export function getDojangApprovalStatus(
  role: RawUserRole,
  dojangStatus: RawDojangStatus,
): AdminDojangApprovalStatus | null {
  if (getUserType(role) !== '도장') {
    return null;
  }

  if (dojangStatus === 'approved') {
    return '승인완료';
  }

  if (dojangStatus === 'rejected') {
    return '승인거부';
  }

  if (dojangStatus === 'pending') {
    return '승인대기';
  }

  if (role === 'manager' || role === 'dojang') {
    return '승인완료';
  }

  return '승인대기';
}

function buildDojangByProfileIdMap(dojangs: DojangQueryRow[]) {
  const dojangByProfileId = new Map<string, DojangQueryRow>();

  for (const dojang of dojangs) {
    if (!dojang.profile_id || dojangByProfileId.has(dojang.profile_id)) {
      continue;
    }

    dojangByProfileId.set(dojang.profile_id, dojang);
  }

  return dojangByProfileId;
}

export function mapProfileQueryRowToAdminUserRow(
  profile: ProfileQueryRow,
  dojangByProfileId: Map<string, DojangQueryRow>,
): AdminUserRow {
  const dojang = dojangByProfileId.get(profile.id) ?? null;

  return {
    id: profile.id,
    avatar_url: profile.avatar_url,
    nickname: formatNickname(profile.nickname),
    name: formatOptionalText(profile.name),
    email: formatEmail(profile.email_value),
    user_type: getUserType(profile.role),
    account_status: getAccountStatusLabel(profile.account_status),
    dojang_approval_status: getDojangApprovalStatus(
      profile.role,
      dojang?.dojang_status ?? null,
    ),
    joined_at: formatUserDate(profile.created_at),
    raw_role: profile.role,
    raw_account_status: profile.account_status,
    raw_dojang_status: dojang?.dojang_status ?? null,
    bio: profile.bio,
    belt_level: profile.belt_level,
    business_number: dojang?.business_number ?? null,
    representative: dojang?.representative ?? null,
    phone_value: dojang?.phone_value ?? null,
    address: dojang?.address ?? null,
    business_file_url: dojang?.business_file_url ?? null,
  };
}

export function mapProfilesToAdminUserRows(
  profiles: ProfileQueryRow[],
  dojangs: DojangQueryRow[],
) {
  const dojangByProfileId = buildDojangByProfileIdMap(dojangs);

  return profiles.map((profile) =>
    mapProfileQueryRowToAdminUserRow(profile, dojangByProfileId),
  );
}

export function matchesUserFilter(
  user: AdminUserRow,
  activeFilter: AdminUserFilterValue,
) {
  if (activeFilter === 'all') {
    return true;
  }

  return user.user_type === activeFilter;
}

export function filterAdminUsers(
  users: AdminUserRow[],
  activeFilter: AdminUserFilterValue,
  searchQuery: string,
) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return users.filter((user) => {
    const isFilterMatched = matchesUserFilter(user, activeFilter);

    const isSearchMatched =
      normalizedSearchQuery.length === 0 ||
      user.nickname.toLowerCase().includes(normalizedSearchQuery) ||
      user.name.toLowerCase().includes(normalizedSearchQuery) ||
      user.email.toLowerCase().includes(normalizedSearchQuery);

    return isFilterMatched && isSearchMatched;
  });
}
