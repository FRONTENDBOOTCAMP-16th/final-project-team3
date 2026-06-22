'use client';

import { useMyBookmarks } from '@/hooks/useMyPage';
import PostListBase from '@/components/common/PostListBase';

export default function BookmarkList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMyBookmarks();

  return (
    <PostListBase
      data={data}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      emptyMessage="아직 저장한 게시글이 없어요"
    />
  );
}
