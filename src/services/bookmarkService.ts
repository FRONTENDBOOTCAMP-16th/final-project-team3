import { supabase } from '@/lib/supabase/client';

export interface BookmarkedPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  comment_count: number;
  bookmarked_at: string;
}

export async function fetchMyBookmarks(page = 0): Promise<BookmarkedPost[]> {
  const PAGE_SIZE = 10;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('bookmarks')
    .select('created_at, posts(id, title, content, category, created_at, active_comment_counts(count))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (error || !data) return [];

  return data
    .filter((b) => b.posts !== null)
    .map((b) => {
      const post = b.posts as unknown as {
        id: string; title: string; content: string; category: string;
        created_at: string; active_comment_counts: { count: number }[];
      };
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        created_at: post.created_at,
        comment_count: post.active_comment_counts?.[0]?.count ?? 0,
        bookmarked_at: b.created_at,
      };
    });
}

export async function fetchMyBookmarkCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  const { count } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);
  return count ?? 0;
}
