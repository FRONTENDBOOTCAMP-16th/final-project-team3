import { timeAgo } from '@/utils/timeAgo';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
  href?: string;
  headerActions?: React.ReactNode;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function PostDetailCard({
  post,
  href,
  headerActions,
  onLike,
  isLiked,
}: PostDetailCardProps) {
  const roleBadge =
    post.role === 'manager'
      ? { label: '도장', className: 'bg-blue-50 text-blue-600' }
      : post.role === 'admin'
        ? { label: '관리자', className: 'bg-red-50 text-red-600' }
        : { label: '일반', className: 'bg-gray-100 text-gray-600' };

  const card = (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
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
              <span className="text-sm font-semibold text-gray-900">
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
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Image
                src="/postTime.svg"
                alt="시간"
                width={11}
                height={11}
                className="opacity-50"
              />
              {timeAgo(post.created_at)}
            </p>
          </div>
        </div>
        {headerActions && (
          <div className="flex items-center gap-1 [&_button]:cursor-pointer">
            {headerActions}
          </div>
        )}
      </div>

      <div className="px-5 pb-3">
        <h1 className="text-lg font-bold text-gray-900">{post.title}</h1>
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
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4">
        <button
          onClick={onLike}
          disabled={!onLike}
          aria-pressed={isLiked}
          aria-label={`좋아요 ${post.likeCount}개`}
          className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
        >
          <Heart
            size={16}
            className={isLiked ? 'fill-danger text-danger' : 'text-gray-500'}
          />
          <span className={isLiked ? 'text-danger' : 'text-gray-500'}>
            좋아요 {post.likeCount}
          </span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Image src="/postComment.svg" alt="댓글" width={16} height={16} />
          <span>댓글 {post.commentCount}</span>
        </div>
        <span className="text-xs text-gray-500">조회 {post.view_count}</span>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}
