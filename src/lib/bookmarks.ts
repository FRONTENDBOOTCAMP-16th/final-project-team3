import { supabase } from './supabase/client';

export async function getIsBookmarked(postId: string, userId: string) {
  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}

export async function toggleBookmark(
  postId: string,
  userId: string,
  isBookmarked: boolean,
) {
  if (isBookmarked) {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
  } else {
    await supabase.from('bookmarks').insert({ post_id: postId, user_id: userId });
  }
}
