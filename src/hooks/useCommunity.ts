import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/communityService';
import type { Post } from '@/types/community';

const PAGE_SIZE = 10;

function createPostsSeed(posts: Post[]) {
  return JSON.stringify(
    posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image_url: post.image_url ?? null,
      status: post.status ?? null,
      deleted_at: post.deleted_at ?? null,
      updated_at: post.updated_at ?? null,
      created_at: post.created_at,
    })),
  );
}

export function usePosts(initialPosts: Post[]) {
  const initialPostsSeed = createPostsSeed(initialPosts);

  return useInfiniteQuery({
    queryKey: ['posts', initialPostsSeed],
    queryFn: ({ pageParam = 0 }) => getPosts(pageParam, PAGE_SIZE),
    initialData: {
      pages: [initialPosts],
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
