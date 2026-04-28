import { useQuery } from '@tanstack/react-query';
import { getCompetitions } from '../lib/getCompetitions';

export function useCompetiton() {
  const res = useQuery({
    queryKey: ['competition'],
    queryFn: getCompetitions,
  });
  return res;
}
