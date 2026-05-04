'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLike } from '@/hooks/useLike';
import { formatDate } from '@/utils/formatDate';
import { Heart, MessageCircle } from 'lucide-react';

interface PostCardProps {
  post: {
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
  };
  userId: string;
}

const categoryMap: Record<string, { label: string; color: string }> = {
  promo: { label: '도장', color: 'bg-[#155DFC]' },
  notice: { label: '공지', color: 'bg-[#e7000b]' },
  personal: { label: '일반', color: 'bg-[#364153]' },
};

export default function PostCard({ post, userId }: PostCardProps) {
  const { likeCount, isLiked, toggle } = useLike(post.id, userId);
  const categoryInfo = categoryMap[post.category] ?? categoryMap.personal;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    toggle();
  };

  return (
    <Link href={`/community/${post.id}`} className="block w-full">
      <div className="rounded-lg overflow-hidden border bg-bg-white border-gray-200 flex flex-col h-97.5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        {/* 이미지 영역 */}
        <div className="relative w-full h-50 bg-btn-basic shrink-0">
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="eager"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-text-secondary text-sm">이미지 없음</span>
            </div>
          )}
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded-full ${categoryInfo.color}`}
          >
            {categoryInfo.label}
          </span>
        </div>

        {/* 카드 내용 */}
        <div className="p-4 flex flex-col gap-2 flex-1 overflow-hidden">
          <h2 className="font-bold text-base line-clamp-1">{post.title}</h2>
          <p className="text-sm text-text-secondary line-clamp-2">
            {post.content}
          </p>

          <div className="flex-1" />

          {/* 날짜 + 조회수 + 댓글수 */}
          <div className="flex gap-3 text-xs text-text-secondary items-center">
            <span>{formatDate(post.created_at)}</span>
            <span>조회 {post.view_count}</span>
            <span className="flex items-center gap-1">
              <MessageCircle size={12} />
              <span className="translate-y-px">{post.comment_count ?? 0}</span>
            </span>
          </div>

          <div className="border-t border-gray-200" />

          {/* 프로필 + 좋아요 */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 shrink-0">
                <Image
                  src={post.avatar_url || '/basic.svg'}
                  alt={post.nickname}
                  fill
                  sizes="24px"
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-sm">{post.nickname}</span>
            </div>

            {/* 좋아요 버튼 */}
            <div className="w-12 flex items-center justify-end">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 transition-all duration-200"
              >
                <Heart
                  size={16}
                  className={
                    isLiked ? 'fill-danger text-danger' : 'text-text-secondary'
                  }
                />
                <span
                  className={`text-sm w-2 text-right ${isLiked ? 'text-danger' : 'text-text-secondary'}`}
                >
                  {likeCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
