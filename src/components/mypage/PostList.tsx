'use client';

import { useEffect, useRef } from 'react';
import { useMyPosts } from '@/hooks/useMyPage';
import PostCard from '@/components/community/Postcard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface PostListProps {
  userId: string;
}

export default function PostList({ userId }: PostListProps) {
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

  if (isLoading) return <LoadingSpinner />;

  const posts = data?.pages.flatMap((page) => page) ?? [];

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg">아직 작성한 게시글이 없어요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} userId={userId} />
      ))}
      <div ref={observerRef} className="h-4" />
      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
}
