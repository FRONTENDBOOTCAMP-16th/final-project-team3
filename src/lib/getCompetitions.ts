import { supabase } from '@/lib/supabase';

export async function getCompetitions() {
  const { error, data } = await supabase
    .from('competition')
    .select('*, comments(count)')
    .order('event_data', { ascending: true });
  if (error) throw error;

  return data.map((competition) => ({
    ...competition,
    comment_count: (competition.comments as { count: number }[])[0]?.count ?? 0,
    comments: undefined,
  }));
}
