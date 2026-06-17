import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIsBookmarked, toggleBookmark } from '@/lib/bookmarks';

export function useBookmark(postId: string, userId: string) {
  const queryClient = useQueryClient();

  const { data: isBookmarked = false } = useQuery({
    queryKey: ['isBookmarked', postId, userId],
    queryFn: () => getIsBookmarked(postId, userId),
    enabled: !!userId && !!postId,
  });

  const { mutate: toggle } = useMutation({
    mutationFn: () => toggleBookmark(postId, userId, isBookmarked),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['isBookmarked', postId, userId] });
      queryClient.setQueryData(['isBookmarked', postId, userId], !isBookmarked);
    },
    onError: () => {
      queryClient.setQueryData(['isBookmarked', postId, userId], isBookmarked);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['isBookmarked', postId, userId] });
      queryClient.invalidateQueries({ queryKey: ['mypage', 'bookmarks'] });
    },
  });

  return { isBookmarked, toggle };
}
