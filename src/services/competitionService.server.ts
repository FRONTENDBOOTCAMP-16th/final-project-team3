import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { cacheTag } from 'next/cache';
import type { Competition } from '@/types/competition';

export async function getCompetition(id: string): Promise<Competition | null> {
  'use cache';
  cacheTag(`competition-${id}`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
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
