import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/communityService';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 0, // 항상 최신 데이터 가져오기
  });
}
