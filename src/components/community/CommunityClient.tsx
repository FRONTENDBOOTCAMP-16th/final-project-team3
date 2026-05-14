'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pageheader from '@/components/layout/PageHeader';
import Postcard from '@/components/community/Postcard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce } from '@/hooks/useDebounce';
import { usePosts } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import type { Post } from '@/types/community';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface CommunityClientProps {
  initialPosts: Post[];
}

export default function CommunityClient({
  initialPosts,
}: CommunityClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? '전체';

  const [searchQuery, setSearchQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(160);
  const headerRef = useRef<HTMLDivElement>(null);
  const isScrollRestoredRef = useRef(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { user, loading } = useAuth();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts();

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page) ?? initialPosts,
    [data, initialPosts],
  );

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
    window.scrollTo(0, 0);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchTab =
        activeTab === '전체' ||
        (activeTab === '공지' && post.category === 'notice') ||
        (activeTab === '도장 홍보' && post.category === 'promo') ||
        (activeTab === '일반 게시글' && post.category === 'personal');
      const matchSearch = post.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [posts, activeTab, debouncedSearch]);

  useEffect(() => {
    const lastPostId = sessionStorage.getItem('lastPostId');
    if (isScrollRestoredRef.current || !lastPostId) return;
    if (filteredPosts.length > 0) {
      const timer = setTimeout(() => {
        const el = document.getElementById(lastPostId);
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: 'instant' });
          sessionStorage.removeItem('lastPostId');
          isScrollRestoredRef.current = true;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filteredPosts]);

  const observerRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <main className="w-full min-h-screen" aria-label="커뮤니티 게시글 목록">
      <div
        ref={headerRef}
        className="fixed top-0 left-50 right-0 z-10 bg-white shadow-sm flex justify-center"
      >
        <div className="w-full max-w-7xl px-6">
          <Pageheader
            title="커뮤니티"
            description="주짓수에 대한 모든 이야기"
            tabs={['전체', '공지', '도장 홍보', '일반 게시글']}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            searchQuery={searchQuery}
            setSearchQuery={(query) => {
              setSearchQuery(query);
            }}
            writeLink={
              loading ? undefined : user ? '/community/write' : undefined
            }
          />
        </div>
      </div>

      <div
        style={{ paddingTop: `${headerHeight + 24}px` }}
        className="pb-20 flex justify-center"
      >
        <div className="w-full max-w-7xl px-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              role="list"
              aria-label="게시글 목록"
              id={`tabpanel-${activeTab}`}
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    id={post.id}
                    role="listitem"
                    className="cursor-pointer"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        sessionStorage.setItem('lastPostId', post.id);
                      }
                    }}
                    onClick={() =>
                      sessionStorage.setItem('lastPostId', post.id)
                    }
                    aria-label={`${post.title} 게시글`}
                  >
                    <Postcard
                      post={{
                        ...post,
                        nickname: post.nickname ?? '알 수 없음',
                        avatar_url: post.avatar_url ?? '',
                        image_url: post.image_url ?? '',
                      }}
                      userId={user?.id ?? ''}
                    />
                  </div>
                ))
              ) : (
                <div
                  className="col-span-full flex flex-col items-center justify-center py-40 text-gray-400 font-light"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="text-lg">조건에 맞는 게시글이 없습니다</p>
                  <p className="text-sm mt-2">새로운 소식을 들려주세요!</p>
                </div>
              )}
            </div>
          )}

          {hasNextPage && (
            <div
              ref={observerRef}
              className="h-20 flex items-center justify-center"
              aria-label="더 많은 게시글 불러오는 중"
              aria-live="polite"
            >
              {isFetchingNextPage && (
                <div
                  className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                  role="status"
                  aria-label="로딩 중"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
