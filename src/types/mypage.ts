import { BeltLevel } from './user';

// 프로필 수정 폼 타입
export interface ProfileUpdateForm {
  nickname: string;
  bio: string;
  belt_level: BeltLevel;
  avatar_url: string | null;
}

// 내가 쓴 게시글 타입 (PostCard props와 맞춤)
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
