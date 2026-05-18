import { supabase } from '@/lib/supabase/client';

export async function createCompetition({
  name,
  location,
  event_data,
  apply_deadline,
  apply_url,
  description,
  image_url,
  user_id,
  participants,
}: {
  name: string;
  location: string;
  event_data: string;
  apply_deadline: string;
  apply_url?: string;
  description?: string;
  image_url?: string;
  user_id?: string;
  participants?: number;
}) {
  const { data, error } = await supabase
    .from('competition')
    .insert({
      name,
      location,
      event_data,
      apply_deadline,
      apply_url,
      description,
      image_url,
      user_id,
      participants,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadCompetitionImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('competition-images')
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage
    .from('competition-images')
    .getPublicUrl(fileName);
  return data.publicUrl;
}

export async function updateCompetition(
  id: string,
  fields: {
    name: string;
    location: string;
    event_data: string;
    apply_deadline: string;
    apply_url?: string;
    description?: string;
    image_url?: string;
    participants?: number;
  },
) {
  const { error } = await supabase
    .from('competition')
    .update(fields)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCompetition(id: string) {
  const { error } = await supabase
    .from('competition')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}
