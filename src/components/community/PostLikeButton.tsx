'use client';

import dynamic from 'next/dynamic';
import { Heart } from 'lucide-react';
import ErrorBoundary from '@/components/common/ErrorBoundary';

type PostLikeButtonVariant = 'card' | 'detail';

export interface PostLikeButtonProps {
  postId: string;
  userId: string | null;
  variant?: PostLikeButtonVariant;
}

const PostLikeButtonContent = dynamic(() => import('./PostLikeButtonContent'), {
  ssr: false,
  loading: (props) => {
    const { variant } = props as unknown as Pick<
      PostLikeButtonProps,
      'variant'
    >;
    return <PostLikeFallback variant={variant ?? 'card'} />;
  },
});

function PostLikeFallback({ variant }: { variant: PostLikeButtonVariant }) {
  if (variant === 'detail') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Heart size={16} aria-hidden="true" />
        <span>좋아요 -</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-text-secondary">
      <Heart size={16} aria-hidden="true" />
      <span className="text-sm">좋아요 -</span>
    </div>
  );
}

export default function PostLikeButton({
  variant = 'card',
  ...props
}: PostLikeButtonProps) {
  return (
    <ErrorBoundary
      key={`${variant}-${props.postId}`}
      fallback={<PostLikeFallback variant={variant} />}
    >
      <PostLikeButtonContent {...props} variant={variant} />
    </ErrorBoundary>
  );
}
