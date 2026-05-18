'use client';

import { Heart } from 'lucide-react';
import { useLike } from '@/hooks/useLike';
import { showErrorToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import type { PostLikeButtonProps } from './PostLikeButton';

export default function PostLikeButtonContent({
  postId,
  userId,
  variant = 'card',
}: PostLikeButtonProps) {
  const { likeCount, isLiked, toggle } = useLike(postId, userId ?? '');
  const isDetail = variant === 'detail';

  const handleLike = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!userId) {
      showErrorToast('로그인이 필요합니다');
      return;
    }

    toggle();
  };

  return (
    <button
      onClick={handleLike}
      aria-pressed={isLiked}
      aria-label={`좋아요 ${likeCount ?? 0}개${
        isLiked ? ', 좋아요 취소하기' : ', 좋아요 누르기'
      }`}
      className={cn(
        'flex items-center gap-1 transition-all duration-200 cursor-pointer p-3 -m-3',
        isDetail && 'gap-1.5 text-xs',
      )}
    >
      <Heart
        size={16}
        aria-hidden="true"
        className={isLiked ? 'fill-danger text-danger' : 'text-text-secondary'}
      />
      <span
        className={cn(
          isLiked ? 'text-danger' : 'text-text-secondary',
          isDetail ? 'text-xs' : 'text-sm w-2 text-right',
        )}
        aria-hidden={!isDetail}
      >
        {isDetail ? `좋아요 ${likeCount ?? 0}` : (likeCount ?? 0)}
      </span>
    </button>
  );
}
