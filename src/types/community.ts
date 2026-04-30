export type PostCategory = 'personal' | 'promo' | 'notice';

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: PostCategory;
  image_url?: string;
  view_count: number;
  report_count: number;
  created_at: string;
  updated_at?: string;
  // profiles join (flat)
  nickname?: string;
  avatar_url?: string;
  belt_level?: string;
  role?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  // profiles join (flat)
  nickname?: string;
  avatar_url?: string;
  belt_level?: string;
  role?: string;
}
