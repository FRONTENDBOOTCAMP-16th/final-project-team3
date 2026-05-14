import { timeAgo } from '@/utils/timeAgo';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export interface PostDetailCardData {
  nickname: string;
  avatar_url?: string | null;
  role?: string | null;
  created_at: string;
  title: string;
  image_url?: string | null;
  content: string;
  likeCount: number;
  commentCount: number;
  view_count: number;
}

interface PostDetailCardProps {
  post: PostDetailCardData;
  headerActions?: React.ReactNode;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function PostDetailCard({
  post,
  headerActions,
  onLike,
  isLiked,
}: PostDetailCardProps) {
  const roleBadge =
    post.role === 'manager'
      ? {
          label: '도장',
          className: 'bg-category-promo-bg text-category-text',
        }
      : post.role === 'admin'
        ? {
            label: '공지',
            className: 'bg-category-notice-bg text-category-text',
          }
        : {
            label: '일반',
            className: 'bg-category-personal-bg text-category-text',
          };

  return (
    <div className="bg-bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-btn-basic overflow-hidden shrink-0">
            {post.avatar_url && (
              <Image
                src={post.avatar_url}
                alt={`${post.nickname} 프로필 이미지`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-text-primary">
                {post.nickname}
              </span>
              {post.role && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge.className}`}
                >
                  {roleBadge.label}
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
              <Image
                src="/postTime.svg"
                alt=""
                aria-hidden="true"
                width={11}
                height={11}
                className="opacity-50"
              />
              {timeAgo(post.created_at)}
            </p>
          </div>
        </div>
        {headerActions && (
          <div className="flex items-center gap-3 [&_button]:cursor-pointer">
            {headerActions}
          </div>
        )}
      </div>

      <div className="px-5 pb-3">
        <h1 className="text-lg font-bold text-text-primary">{post.title}</h1>
      </div>

      {post.image_url && (
        <div className="px-5 pb-4">
          <div className="rounded-xl overflow-hidden">
            <Image
              src={post.image_url}
              alt={`${post.title} 게시글 이미지`}
              width={800}
              height={400}
              className="w-full object-cover max-h-72"
            />
          </div>
        </div>
      )}

      <div className="px-5 pb-5">
        <p className="text-sm text-text-primary whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      <div className="px-5 py-3 border-t border-border flex items-center gap-4">
        <button
          onClick={onLike}
          disabled={!onLike}
          aria-pressed={isLiked}
          aria-label={`좋아요 ${post.likeCount}개`}
          className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
        >
          <Heart
            size={16}
            className={
              isLiked ? 'fill-danger text-danger' : 'text-text-secondary'
            }
          />
          <span className={isLiked ? 'text-danger' : 'text-text-secondary'}>
            좋아요 {post.likeCount}
          </span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Image
            src="/postComment.svg"
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
          />
          <span>댓글 {post.commentCount}</span>
        </div>
        <span className="text-xs text-text-secondary">
          조회 {post.view_count}
        </span>
      </div>
    </div>
  );
}
