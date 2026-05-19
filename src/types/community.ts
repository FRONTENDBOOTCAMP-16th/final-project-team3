export type PostCategory = 'personal' | 'promo' | 'notice';

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: PostCategory;
  status?: 'published' | 'hidden' | string | null;
  deleted_at?: string | null;
  image_url?: string;
  report_count: number;
  comment_count: number;
  created_at: string;
  updated_at?: string;
  nickname?: string;
  avatar_url?: string;
  belt_level?: string;
  role?: string;
}

export interface Comment {
  id: string;
  post_id?: string;
  competition_id?: string;
  user_id: string;
  content: string;
  created_at: string;
  deleted_at?: string | null;
  nickname?: string;
  avatar_url?: string;
  belt_level?: string;
  role?: string;
}
