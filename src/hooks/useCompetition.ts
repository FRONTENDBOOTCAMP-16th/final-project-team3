import { useInfiniteQuery } from '@tanstack/react-query';
import { getCompetitions } from '@/lib/getCompetitions';
import type { Competition } from '@/types/competition';

const PAGE_SIZE = 10;

export function useCompetition(initialCompetitions: Competition[]) {
  return useInfiniteQuery({
    queryKey: ['competition'],
    queryFn: ({ pageParam = 0 }) => getCompetitions(pageParam, PAGE_SIZE),
    initialData: {
      pages: [initialCompetitions],
      pageParams: [0],
    },
    initialDataUpdatedAt: Date.now(),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 0, // 대회 등록/수정 후 즉시 최신 목록 반영
  });
}
