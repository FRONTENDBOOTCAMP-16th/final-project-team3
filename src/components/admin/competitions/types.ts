export type AdminCompetitionStatus = '모집중' | '마감임박' | '모집완료';
export type AdminCompetitionPublishStatus = '게시중' | '삭제';

export type AdminCompetitionFilterValue = 'all' | AdminCompetitionStatus;

export interface AdminCompetitionFilterOption {
  label: string;
  value: AdminCompetitionFilterValue;
}

export interface AdminCompetitionRow {
  id: string;
  name: string;
  location: string;
  status: AdminCompetitionStatus;
  publish_status: AdminCompetitionPublishStatus;
  event_date: string;
  apply_deadline: string;
  created_at: string;
}

export interface CompetitionQueryRow {
  id: string;
  name: string;
  location: string | null;
  event_data: string;
  apply_deadline: string;
  created_at: string;
  deleted_at: string | null;
}
