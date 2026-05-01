export type AdminPageKey = 'dashboard' | 'post' | 'user' | 'support';

interface AdminMeta {
  title: string;
  description: string;
}

export const ADMIN_META: Record<AdminPageKey, AdminMeta> = {
  dashboard: {
    title: '대시보드',
    description: '관리자 현황을 한눈에 확인하세요',
  },
  post: {
    title: '게시글 관리',
    description: '전체 게시글을 관리합니다',
  },
  user: {
    title: '유저 관리',
    description: '전체 사용자를 관리합니다',
  },
  support: {
    title: '고객지원',
    description: '도장 인증, 신고 내역, 문의 내역을 관리합니다',
  },
};
