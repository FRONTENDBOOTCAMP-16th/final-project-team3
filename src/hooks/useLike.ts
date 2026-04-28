import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLikesCount, getIsLiked, toggleLike } from '../lib/likes';

export function useLike(postId: string, userId: string) {
  const queryClient = useQueryClient();
  const { data: likeCount = 0 } = useQuery({
    queryKey: ['likeCount', postId],
    queryFn: () => getLikesCount(postId),
    enabled: !!postId, // postId 있을 때만 실행
  });

  const { data: isLiked = false } = useQuery({
    queryKey: ['isLiked', postId, userId],
    queryFn: () => getIsLiked(postId, userId),
    enabled: !!userId, // userId 있을 때만 실행
  });

  const { mutate: toggle } = useMutation({
    mutationFn: () => toggleLike(postId, userId, isLiked),
    onSuccess: () => {
      // 좋아요 누르면 likeCount랑 isLiked 자동 갱신
      queryClient.invalidateQueries({ queryKey: ['likeCount', postId] });
      queryClient.invalidateQueries({ queryKey: ['isLiked', postId, userId] });
    },
  });

  return { likeCount, isLiked, toggle };
}
