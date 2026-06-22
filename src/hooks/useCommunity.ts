import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getPosts, getSportPosts, getPromoPosts } from '@/services/communityService';
import type { Post } from '@/types/community';

const PAGE_SIZE = 10;

export function usePosts(initialPosts: Post[]) {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => getPosts(pageParam, PAGE_SIZE),
    initialData: {
      pages: [initialPosts],
      pageParams: [0],
    },
    initialDataUpdatedAt: Date.now(),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 0, // 글 작성/삭제 후 즉시 최신 목록 반영
  });
}

export function usePromoPosts() {
  return useQuery({
    queryKey: ['posts', 'promo'],
    queryFn: () => getPromoPosts(20),
    staleTime: 1000 * 60 * 5, // 홍보 게시글은 자주 바뀌지 않으므로 5분 캐시
  });
}

export function useSportPosts(sport: string, initialPosts: Post[]) {
  return useInfiniteQuery({
    queryKey: ['posts', 'sport', sport],
    queryFn: ({ pageParam = 0 }) => getSportPosts(sport, pageParam, PAGE_SIZE),
    initialData: {
      pages: [initialPosts],
      pageParams: [0],
    },
    initialDataUpdatedAt: Date.now(),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 0, // 글 작성/삭제 후 즉시 최신 목록 반영
  });
}
