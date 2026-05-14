import { BeltLevel } from './user';

export interface ProfileUpdateForm {
  nickname: string;
  bio: string;
  belt_level: BeltLevel;
  avatar_url: string | null;
}

export interface MyPost {
  id: string;
  title: string;
  content: string;
  category: string;
  nickname: string;
  avatar_url: string;
  image_url: string;
  view_count: number;
  created_at: string;
  comment_count: number;
}
