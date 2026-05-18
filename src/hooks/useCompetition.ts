import { useInfiniteQuery } from '@tanstack/react-query';
import { getCompetitions } from '@/lib/getCompetitions';
import type { Competition } from '@/types/competition';

const PAGE_SIZE = 10;

function createCompetitionsSeed(competitions: Competition[]) {
  return JSON.stringify(
    competitions.map((competition) => ({
      id: competition.id,
      name: competition.name,
      location: competition.location,
      event_data: competition.event_data,
      apply_deadline: competition.apply_deadline,
      deleted_at: competition.deleted_at ?? null,
      created_at: competition.created_at,
    })),
  );
}

export function useCompetition(initialCompetitions: Competition[]) {
  const initialCompetitionsSeed = createCompetitionsSeed(initialCompetitions);

  return useInfiniteQuery({
    queryKey: ['competition', initialCompetitionsSeed],
    queryFn: ({ pageParam = 0 }) => getCompetitions(pageParam, PAGE_SIZE),
    initialData: {
      pages: [initialCompetitions],
      pageParams: [0],
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 30,
  });
}
