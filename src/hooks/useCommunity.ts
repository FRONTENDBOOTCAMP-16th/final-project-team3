import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/communityService';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 1000 * 30, // 30초
  });
}
