'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/utils/formatDate';
import { buildPostUrl } from '@/lib/slug';
import { categoryMap } from '@/constants/categoryMap';

export interface PostListItem {
  id: string;
  title: string;
  category: string;
  created_at: string;
  comment_count?: number;
}

export interface PostListBaseProps {
  data: { pages: PostListItem[][] } | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  emptyMessage: string;
}

export default function PostListBase({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  emptyMessage,
}: PostListBaseProps) {
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
        style={{ color: 'var(--color-text-disabled)' }}
      >
        <p style={{ fontSize: '15px' }}>{emptyMessage}</p>
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
                borderBottom: '1px solid var(--color-border)',
                padding: '18px 0',
              }}
            >
              <div
                className="font-semibold mb-1.5 group-hover:opacity-75 transition-opacity"
                style={{
                  fontSize: '15.5px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {post.title}
              </div>
              <div
                className="flex gap-1.5"
                style={{
                  fontSize: '11.5px',
                  color: 'var(--color-text-disabled)',
                }}
              >
                <span
                  className="font-semibold"
                  style={{ color: 'var(--color-text-hint)' }}
                >
                  {categoryInfo.label}
                </span>
                <span style={{ color: 'var(--color-text-disabled)' }}>·</span>
                <time dateTime={post.created_at}>
                  {formatDate(post.created_at)}
                </time>
                {post.comment_count !== undefined && (
                  <>
                    <span style={{ color: 'var(--color-text-disabled)' }}>·</span>
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
