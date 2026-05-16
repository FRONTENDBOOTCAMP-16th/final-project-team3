import 'server-only';
import { supabasePublic } from '@/lib/supabase/public';
import { cacheLife, cacheTag } from 'next/cache';
import type { Competition } from '@/types/competition';

export async function getCompetition(id: string): Promise<Competition | null> {
  'use cache';
  cacheTag(`competition-${id}`);
  cacheLife('minutes');

  const { data, error } = await supabasePublic
    .from('competition')
    .select('*, profiles(nickname, avatar_url, role)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    nickname: data.profiles?.nickname,
    avatar_url: data.profiles?.avatar_url,
    role: data.profiles?.role,
    profiles: undefined,
  } as Competition;
}

export function isPublicCompetitionVisible(
  competition: Competition | null | undefined,
): competition is Competition {
  return Boolean(
    competition &&
    (competition.deleted_at === null || competition.deleted_at === undefined),
  );
}
