'use client';

import { useMyPosts } from '@/hooks/useMyPage';
import PostListBase from '@/components/common/PostListBase';

export default function PostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMyPosts();

  return (
    <PostListBase
      data={data}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      emptyMessage="아직 작성한 게시글이 없어요"
    />
  );
}
