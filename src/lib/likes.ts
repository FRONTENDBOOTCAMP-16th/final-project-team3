import { supabase } from './supabase';

export async function getLikesCount(postId: string) {
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact' })
    .eq('post_id', postId);
  return count;
}

export async function getIsLiked(postId: string, userId: string) {
  // likes 테이블에서 post_id랑 user_id 둘 다 일치하는 행 찾기
  const { data } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId);

  return (data?.length ?? 0) > 0;
}

export async function toggleLike(
  postId: string,
  userId: string,
  isLiked: boolean,
) {
  if (isLiked) {
    await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
  } else {
    await supabase.from('likes').insert({ post_id: postId, user_id: userId });
  }
}
