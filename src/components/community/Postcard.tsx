import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <Link href={`/community/${post.id}`}>
      <div className="rounded-lg h-97.5 overflow-hidden border border-gray-200 flex flex-col">
        {/* 썸네일 + 배지 */}
        <div className="relative">
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
            ${post.category === 'promo' ? 'bg-[#155DFC]' : 'bg-[#364153]'}`}
          >
            {post.category === 'promo' ? '도장' : '일반'}
          </span>
        </div>

        {/* 카드 내용 */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* 제목 */}
          <h2 className="font-bold text-base line-clamp-1">{post.title}</h2>

          {/* 내용 미리보기 */}
          <p className="text-sm text-gray-500 line-clamp-2">{post.content}</p>

          {/* 빈 공간 */}
          <div className="flex-1" />

          {/* 시간 + 조회수 */}
          <div className="flex gap-3 text-xs text-gray-400">
            <span>{post.created_at}</span>
            <span>조회 {post.view_count}</span>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-100" />

          {/* 프로필 + 좋아요 */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200" />
              <span className="text-sm">{post.nickname}</span>
            </div>
            <span className="text-sm text-gray-400">♡ 0</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
