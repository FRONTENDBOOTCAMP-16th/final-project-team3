export type CompetitionStatus = '모집중' | '마감임박' | '모집 완료';

export interface Competition {
  id: string;
  name: string;
  location: string;
  event_data: string;
  apply_deadline: string;
  deleted_at?: string | null;
  apply_url?: string;
  description?: string;
  image_url?: string;
  user_id?: string;
  created_at: string;
  participants?: number;
  nickname?: string;
  avatar_url?: string;
  role?: string;
}
