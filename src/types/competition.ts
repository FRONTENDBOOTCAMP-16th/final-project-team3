export type CompetitionStatus = '모집중' | '마감임박' | '모집 완료';

export interface Competition {
  id: string;
  name: string;
  location: string;
  event_date: string;
  category?: string;
  status: CompetitionStatus;
  created_at: string;
}
