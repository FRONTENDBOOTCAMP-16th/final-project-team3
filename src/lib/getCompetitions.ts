import { supabase } from '@/src/lib/supabase';

export async function getCompetitions() {
  const { error, data } = await supabase
    .from('competition')
    .select('*')
    .order('event_data', { ascending: true });
  if (error) throw error;
  return data;
}
