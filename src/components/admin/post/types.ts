export type AdminPostStatus = 'published' | 'hidden';

export type AdminPostCategory = '일반' | '도장홍보' | '공지';

export type DbPostCategory = 'personal' | 'promo' | 'notice';

export type AdminPostFilterValue = 'all' | AdminPostCategory;

export interface AdminPostFilterOption {
  label: string;
  value: AdminPostFilterValue;
}

export interface AdminPostRow {
  id: string;
  category: AdminPostCategory;
  title: string;
  author: string;
  status: AdminPostStatus;
  deleted_at: string | null;
  view_count: number;
  report_count: number;
  created_at: string;
}

export type ProfileRow = {
  nickname: string | null;
};

export type PostQueryRow = {
  id: string;
  category: DbPostCategory;
  title: string;
  status: AdminPostStatus;
  deleted_at: string | null;
  view_count: number | null;
  report_count: number | null;
  created_at: string;
  profiles: ProfileRow | ProfileRow[] | null;
};
