'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useMyPosts } from '@/hooks/useMyPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/utils/formatDate';
import { buildPostUrl } from '@/lib/slug';
import { categoryMap } from '@/constants/categoryMap';

interface PostListProps {
  userId: string;
}

export default function PostList({ userId: _userId }: PostListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMyPosts();

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <div className="py-10"><LoadingSpinner /></div>;

  const posts = data?.pages.flatMap((page) => page) ?? [];

  if (posts.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20"
        style={{ color: 'rgba(255,255,255,0.38)' }}
      >
        <p style={{ fontSize: '15px' }}>아직 작성한 게시글이 없어요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => {
        const categoryInfo = categoryMap[post.category] ?? categoryMap.personal;
        return (
          <Link
            key={post.id}
            href={buildPostUrl(post.title, post.id)}
            className="block group"
            aria-label={`${post.title} 게시글 상세보기`}
          >
            <div
              className="cursor-pointer transition-colors"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '18px 0',
              }}
            >
              <div
                className="font-semibold mb-1.5 group-hover:opacity-75 transition-opacity"
                style={{
                  fontSize: '15.5px',
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '-0.01em',
                }}
              >
                {post.title}
              </div>
              <div
                className="flex gap-1.5"
                style={{
                  fontSize: '11.5px',
                  color: 'rgba(255,255,255,0.28)',
                }}
              >
                <span
                  className="font-semibold"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {categoryInfo.label}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.16)' }}>·</span>
                <time dateTime={post.created_at}>
                  {formatDate(post.created_at)}
                </time>
                {post.comment_count !== undefined && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.16)' }}>·</span>
                    <span>댓글 {post.comment_count}</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}

      <div ref={observerRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
