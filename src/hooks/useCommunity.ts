import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/communityService';
import type { Post } from '@/types/community';

const PAGE_SIZE = 10;
const INITIAL_DATA_UPDATED_AT = Date.now();

export function usePosts(initialPosts: Post[]) {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => getPosts(pageParam, PAGE_SIZE),
    initialData: {
      pages: [initialPosts],
      pageParams: [0],
    },
    initialDataUpdatedAt: INITIAL_DATA_UPDATED_AT,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 0,
  });
}
