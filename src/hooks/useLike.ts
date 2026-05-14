import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLikesCount, getIsLiked, toggleLike } from '../lib/likes';

export function useLike(postId: string, userId: string) {
  const queryClient = useQueryClient();
  const { data: likeCount = 0 } = useQuery({
    queryKey: ['likeCount', postId],
    queryFn: () => getLikesCount(postId),
    enabled: !!postId,
  });

  const { data: isLiked = false } = useQuery({
    queryKey: ['isLiked', postId, userId],
    queryFn: () => getIsLiked(postId, userId),
    enabled: !!userId,
  });

  const { mutate: toggle } = useMutation({
    mutationFn: () => toggleLike(postId, userId, isLiked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeCount', postId] });
      queryClient.invalidateQueries({ queryKey: ['isLiked', postId, userId] });
    },
  });

  return { likeCount, isLiked, toggle };
}
