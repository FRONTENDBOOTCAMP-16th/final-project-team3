import type { Metadata } from 'next';

export type AdminPageKey =
  | 'dashboard'
  | 'posts'
  | 'users'
  | 'support'
  | 'competitions';

interface AdminMeta {
  title: string;
  description: string;
  metadataTitle?: string;
}

export const ADMIN_META: Record<AdminPageKey, AdminMeta> = {
  dashboard: {
    title: '대시보드',
    description: '관리자 현황을 한눈에 확인하세요',
    metadataTitle: '대시 보드',
  },
  posts: {
    title: '게시글 관리',
    description: '전체 게시글을 관리합니다',
  },
  users: {
    title: '유저 관리',
    description: '전체 사용자를 관리합니다',
  },
  support: {
    title: '고객지원',
    description: '도장 인증, 신고 내역을 관리합니다',
    metadataTitle: '고객 지원',
  },
  competitions: {
    title: '대회일정 관리',
    description: '대회일정을 관리합니다.',
  },
};

export const ADMIN_LAYOUT_METADATA: Metadata = {
  title: 'Black Belt BJJ',
  description: 'Black Belt BJJ 관리자 페이지입니다.',
  robots: {
    index: false,
    follow: false,
  },
};

export function getAdminPageMetadata(page: AdminPageKey): Metadata {
  const { title, description, metadataTitle } = ADMIN_META[page];

  return {
    title: `${metadataTitle ?? title} | Black Belt BJJ`,
    description,
  };
}
