import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabasePublic } from '@/lib/supabase/public';
import { cacheTag, cacheLife } from 'next/cache';
import type { Metadata } from 'next';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: '대시보드 | Activio',
  robots: { index: false },
};

async function getUpcomingCompetitions() {
  'use cache';
  cacheTag('competitions');
  cacheLife('minutes');

  const { data } = await supabasePublic
    .from('competition')
    .select('id, name, location, event_data, apply_deadline')
    .is('deleted_at', null)
    .order('event_data', { ascending: true })
    .limit(4);

  return data ?? [];
}

async function getLatestNotice() {
  'use cache';
  cacheTag('posts-list');
  cacheLife('minutes');

  const { data } = await supabasePublic
    .from('posts')
    .select('id, title, content, image_url, created_at, profiles(nickname)')
    .is('deleted_at', null)
    .eq('status', 'published')
    .eq('category', 'notice')
    .order('created_at', { ascending: false })
    .limit(3);

  return (data ?? []).map((p) => ({
    ...p,
    nickname: (p.profiles as unknown as { nickname: string } | null)?.nickname ?? '관리자',
    profiles: undefined,
  }));
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [profileRes, postCountRes, commentCountRes, competitions, notices] =
    await Promise.all([
      supabase.from('profiles').select('nickname, avatar_url, role, belt_level').eq('id', user.id).single(),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('deleted_at', null),
      supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('deleted_at', null),
      getUpcomingCompetitions(),
      getLatestNotice(),
    ]);

  const profile = profileRes.data;

  return (
    <DashboardClient
      profile={{
        nickname: profile?.nickname ?? '사용자',
        avatar_url: profile?.avatar_url ?? null,
        role: profile?.role ?? 'user',
        belt_level: profile?.belt_level ?? null,
      }}
      stats={{
        postCount: postCountRes.count ?? 0,
        commentCount: commentCountRes.count ?? 0,
      }}
      competitions={competitions}
      notices={notices}
    />
  );
}
