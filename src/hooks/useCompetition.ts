import { useInfiniteQuery } from '@tanstack/react-query';
import { getCompetitions } from '@/lib/getCompetitions';

const PAGE_SIZE = 10;

export function useCompetiton() {
  return useInfiniteQuery({
    queryKey: ['competition'],
    queryFn: ({ pageParam = 0 }) => getCompetitions(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
  });
}
