'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLike } from '@/hooks/useLike';
import { formatDate } from '@/utils/formatDate';
import { Heart, MessageCircle } from 'lucide-react';
import { showErrorToast } from '@/lib/toast';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    nickname: string;
    avatar_url: string;
    image_url: string;
    created_at: string;
    comment_count: number;
  };
  userId: string;
}

const categoryMap: Record<string, { label: string; color: string }> = {
  promo: { label: '도장', color: 'bg-category-promo-bg' },
  notice: { label: '공지', color: 'bg-category-notice-bg' },
  personal: { label: '일반', color: 'bg-category-personal-bg' },
};

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1682545888368-587f56efd06e?w=800',
  'https://images.unsplash.com/photo-1681923445357-0679553160da?w=800',
  'https://images.unsplash.com/photo-1611711605692-acb25d5d8399?w=800',
  'https://images.unsplash.com/photo-1599677099972-a36c34a72343?w=800',
  'https://images.unsplash.com/photo-1659137834052-7360235e9db5?w=800',
];

export default function PostCard({ post, userId }: PostCardProps) {
  const { likeCount, isLiked, toggle } = useLike(post.id, userId);
  const categoryInfo = categoryMap[post.category] ?? categoryMap.personal;

  const defaultImage =
    DEFAULT_IMAGES[
      parseInt(post.id.replace(/-/g, '').slice(0, 8), 16) %
        DEFAULT_IMAGES.length
    ];

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      showErrorToast('로그인이 필요합니다');
      return;
    }
    toggle();
  };

  return (
    <Link
      href={`/community/${post.id}`}
      className="block w-full"
      rel="noopener noreferrer"
      aria-label={`${post.title} 게시글 상세보기`}
    >
      <article
        className="rounded-lg overflow-hidden border bg-bg-white border-gray-200 flex flex-col h-97.5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        aria-label={`${post.nickname}의 게시글: ${post.title}`}
      >
        <div className="relative w-full h-50 bg-btn-basic shrink-0">
          <Image
            src={post.image_url || defaultImage}
            alt={`${post.title} 게시글 이미지`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="eager"
            className="object-cover"
          />
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded-full ${categoryInfo.color}`}
            aria-label={`카테고리: ${categoryInfo.label}`}
          >
            {categoryInfo.label}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-2 flex-1 overflow-hidden">
          <h2 className="font-bold text-base line-clamp-1">{post.title}</h2>
          <p className="text-sm text-text-secondary line-clamp-2">
            {post.content}
          </p>

          <div className="flex-1" />

          <div
            className="flex gap-3 text-xs text-text-secondary items-center"
            role="group"
            aria-label="게시글 통계"
          >
            <time dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
            <span
              className="flex items-center gap-1"
              aria-label={`댓글 ${post.comment_count ?? 0}개`}
            >
              <MessageCircle size={12} aria-hidden="true" />
              <span className="translate-y-px">{post.comment_count ?? 0}</span>
            </span>
          </div>

          <div className="border-t border-gray-200" />

          <div className="flex items-center justify-between pt-2">
            <div
              className="flex items-center gap-2"
              aria-label={`작성자: ${post.nickname}`}
            >
              <div className="relative w-6 h-6 shrink-0">
                <Image
                  src={post.avatar_url || '/basic.svg'}
                  alt={`${post.nickname} 프로필 이미지`}
                  fill
                  sizes="24px"
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-sm">{post.nickname}</span>
            </div>

            <div className="w-12 flex items-center justify-end">
              <button
                onClick={handleLike}
                aria-pressed={isLiked}
                aria-label={`좋아요 ${likeCount}개${isLiked ? ', 좋아요 취소하기' : ', 좋아요 누르기'}`}
                className="flex items-center gap-1 transition-all duration-200 cursor-pointer"
              >
                <Heart
                  size={16}
                  aria-hidden="true"
                  className={
                    isLiked ? 'fill-danger text-danger' : 'text-text-secondary'
                  }
                />
                <span
                  className={`text-sm w-2 text-right ${isLiked ? 'text-danger' : 'text-text-secondary'}`}
                  aria-hidden="true"
                >
                  {likeCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
