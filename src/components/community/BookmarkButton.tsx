'use client';

import { Bookmark } from 'lucide-react';
import { useBookmark } from '@/hooks/useBookmark';
import { showErrorToast } from '@/lib/toast';

interface BookmarkButtonProps {
  postId: string;
  userId: string | null;
}

export default function BookmarkButton({ postId, userId }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmark(postId, userId ?? '');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      showErrorToast('로그인이 필요합니다.');
      return;
    }
    toggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? '북마크 해제' : '북마크'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px 9px',
        background: 'transparent',
        border: 'none',
        borderRadius: '999px',
        cursor: 'pointer',
        marginLeft: 'auto',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
    >
      <Bookmark
        size={13}
        strokeWidth={2}
        fill={isBookmarked ? '#f59e0b' : 'none'}
        color={isBookmarked ? '#f59e0b' : 'rgba(255,255,255,0.38)'}
      />
    </button>
  );
}
