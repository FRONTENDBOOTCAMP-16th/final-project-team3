import { supabase } from '@/lib/supabase';
import type { Competition } from '@/types/competition';

export async function createCompetition({
  name,
  location,
  event_data,
  apply_deadline,
  apply_url,
  description,
  image_url,
  user_id,
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
      user_id, // 추가
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

export async function getCompetition(id: string): Promise<Competition> {
  const { data, error } = await supabase
    .from('competition')
    .select('*, profiles(nickname, avatar_url, role)')
    .eq('id', id)
    .single();
  if (error) throw error;

  return {
    ...data,
    nickname: data.profiles?.nickname,
    avatar_url: data.profiles?.avatar_url,
    role: data.profiles?.role,
    profiles: undefined,
  } as Competition;
}
