'use server';
import { revalidatePath, updateTag } from 'next/cache';

import { canManageContent } from '@/lib/contentPermissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ROUTES } from '@/constants/routes';

type CompetitionActionResult = {
  success: boolean;
  message: string;
};

type CompetitionPermissionQueryRow = {
  id: string;
  user_id: string | null;
  profiles: { role: string | null } | { role: string | null }[] | null;
};

export async function revalidateCompetitions() {
  updateTag('competitions');
  revalidatePath(ROUTES.COMPETITIONS);
}

export async function revalidateCompetition(id: string) {
  updateTag(`competition-${id}`);
  revalidatePath(ROUTES.COMPETITIONS_DETAIL(id));
}

export async function deleteManagedCompetition(
  competitionId: string,
): Promise<CompetitionActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: '로그인이 필요합니다.',
    };
  }

  const [{ data: profile, error: profileError }, { data: competition, error: competitionError }] =
    await Promise.all([
      supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(),
      supabase
        .from('competition')
        .select('id, user_id, profiles(role)')
        .eq('id', competitionId)
        .maybeSingle(),
    ]);

  if (profileError || !profile) {
    return {
      success: false,
      message: '사용자 권한을 확인할 수 없습니다.',
    };
  }

  if (competitionError || !competition) {
    return {
      success: false,
      message: '대회 게시글을 찾을 수 없습니다.',
    };
  }

  const competitionRow = competition as CompetitionPermissionQueryRow;
  const competitionAuthorRole = Array.isArray(competitionRow.profiles)
    ? competitionRow.profiles[0]?.role ?? null
    : competitionRow.profiles?.role ?? null;

  if (
    !canManageContent({
      currentUserId: user.id,
      authorUserId: competitionRow.user_id,
      currentUserRole: profile.role,
      authorRole: competitionAuthorRole,
    })
  ) {
    return {
      success: false,
      message: '삭제 권한이 없습니다.',
    };
  }

  const { error: deleteError } = await supabase
    .from('competition')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', competitionId);

  if (deleteError) {
    return {
      success: false,
      message: '대회일정 삭제에 실패했습니다.',
    };
  }

  await Promise.all([
    revalidateCompetitions(),
    revalidateCompetition(competitionId),
  ]);

  return {
    success: true,
    message: '대회일정이 삭제되었습니다.',
  };
}
