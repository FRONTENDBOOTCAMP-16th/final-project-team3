import { supabase } from '@/lib/supabase';

export async function getCompetitions() {
  const { error, data } = await supabase
    .from('competition')
    .select('*, comments(count)')
    .order('event_data', { ascending: true });
  if (error) throw error;

  return data.map((competition: any) => ({
    ...competition,
    comment_count: competition.comments[0].count,
    comments: undefined,
  }));
}
