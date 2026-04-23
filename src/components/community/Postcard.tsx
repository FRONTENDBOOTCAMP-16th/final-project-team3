import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이동 막기
    if (liked) {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <Link href={`/community/${post.id}`}>
      <div className="rounded-lg overflow-hidden border border-gray-200 flex flex-col h-97.5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        {/* 썸네일 + 배지 */}
        <div className="relative shrink-0">
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt={post.title}
              width={400}
              height={200}
              className="w-full h-50 object-cover"
            />
          ) : (
            <div className="w-full h-50 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">이미지 없음</span>
            </div>
          )}
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded-full
              ${post.category === '도장 홍보' ? 'bg-[#155DFC]' : 'bg-[#364153]'}`}
          >
            {post.category === '도장 홍보' ? '도장' : '일반'}
          </span>
        </div>

        {/* 카드 내용 */}
        <div className="p-4 flex flex-col gap-2 flex-1 overflow-hidden">
          <h2 className="font-bold text-base line-clamp-1">{post.title}</h2>
          <p className="text-sm text-gray-500 line-clamp-2">{post.content}</p>

          <div className="flex-1" />

          <div className="flex gap-3 text-xs text-gray-400">
            <span>{post.created_at}</span>
            <span>조회 {post.view_count}</span>
          </div>

          <div className="border-t border-gray-200" />

          {/* 프로필 + 좋아요 */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200" />
              <span className="text-sm">{post.nickname}</span>
            </div>

            {/* 좋아요 버튼 */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:scale-110 transition-all duration-200"
            >
              <Image
                src="/like.svg"
                alt="좋아요"
                width={16}
                height={16}
                className={liked ? 'opacity-100' : 'opacity-40'}
              />
              <span
                className={`text-sm ${liked ? 'text-red-500' : 'text-gray-400'}`}
              >
                {likeCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
