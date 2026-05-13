import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/communityService';

const PAGE_SIZE = 10;

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => getPosts(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지가 PAGE_SIZE보다 작으면 더 이상 없음
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 30,
  });
}
