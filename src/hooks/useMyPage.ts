import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  fetchMyProfile,
  updateMyProfile,
  deleteMyAccount,
  fetchMyPosts,
  fetchMyPostCount,
  fetchMyCommentCount,
} from '@/services/userService';
import { ProfileUpdateForm } from '@/types/mypage';

const myPageKeys = {
  profile: ['mypage', 'profile'] as const,
  posts: ['mypage', 'posts'] as const,
  postCount: ['mypage', 'postCount'] as const,
  commentCount: ['mypage', 'commentCount'] as const,
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: myPageKeys.profile,
    queryFn: fetchMyProfile,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileUpdateForm) => updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myPageKeys.profile });
    },
  });
};

export const useMyPosts = () => {
  return useInfiniteQuery({
    queryKey: myPageKeys.posts,
    queryFn: ({ pageParam = 0 }) => fetchMyPosts(pageParam),
    staleTime: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

export const useDeleteMyAccount = () => {
  return useMutation({
    mutationFn: deleteMyAccount,
  });
};

export const useMyPostCount = () => {
  return useQuery({
    queryKey: myPageKeys.postCount,
    queryFn: fetchMyPostCount,
    staleTime: 0,
  });
};

export const useMyCommentCount = () => {
  return useQuery({
    queryKey: myPageKeys.commentCount,
    queryFn: fetchMyCommentCount,
    staleTime: 0,
  });
};
