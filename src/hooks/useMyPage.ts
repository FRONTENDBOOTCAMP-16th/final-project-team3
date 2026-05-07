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
} from '@/services/userService';
import { ProfileUpdateForm } from '@/types/mypage';

const myPageKeys = {
  profile: ['mypage', 'profile'] as const,
  posts: ['mypage', 'posts'] as const,
};

// 내 프로필 조회
export const useMyProfile = () => {
  return useQuery({
    queryKey: myPageKeys.profile,
    queryFn: fetchMyProfile,
  });
};

// 내 프로필 수정
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileUpdateForm) => updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myPageKeys.profile });
    },
  });
};

// 내가 쓴 게시글 무한스크롤
export const useMyPosts = () => {
  return useInfiniteQuery({
    queryKey: myPageKeys.posts,
    queryFn: ({ pageParam = 0 }) => fetchMyPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

// 회원 탈퇴
export const useDeleteMyAccount = () => {
  return useMutation({
    mutationFn: deleteMyAccount,
  });
};
