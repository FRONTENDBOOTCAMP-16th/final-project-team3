// app/(main)/community/page.tsx - 서버 컴포넌트
import CommunityClient from '@/components/community/CommunityClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Post } from '@/types/community';

async function getPosts(): Promise<Post[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );

  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(count)')
    .order('created_at', { ascending: false });

  if (error) return [];

  return data.map((post) => ({
    ...post,
    comment_count: post.comments?.[0]?.count ?? 0,
  })) as Post[];
}

export default async function CommunityPage() {
  const initialPosts = await getPosts();

  return <CommunityClient initialPosts={initialPosts} />;
}
