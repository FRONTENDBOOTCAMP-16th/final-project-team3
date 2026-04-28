'use client';
import { useState, useRef, useEffect } from 'react';
import Pageheader from '@/components/layout/PageHeader';
import Postcard from '../../../components/community/Postcard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePosts } from '@/hooks/useCommunity';

const PAGE_SIZE = 10;

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: posts = [], isLoading } = usePosts(); // ✅ 교체

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchTab =
      activeTab === '전체' ||
      (activeTab === '도장 홍보' && post.category === 'promo') ||
      (activeTab === '일반 게시글' && post.category === 'personal');
    const matchSearch = post.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    return matchTab && matchSearch;
  });

  const visiblePosts = filteredPosts.slice(0, page * PAGE_SIZE);
  const hasMore = visiblePosts.length < filteredPosts.length;

  const observerRef = useInfiniteScroll(() => {
    if (hasMore) setPage((prev) => prev + 1);
  });

  return (
    <main className="w-full min-h-screen">
      <div
        ref={headerRef}
        className="fixed top-0 left-50 right-0 z-10 bg-white shadow-md flex justify-center"
      >
        <div className="w-full max-w-7xl px-6">
          <Pageheader
            title="커뮤니티"
            description="주짓수에 대한 모든 이야기"
            tabs={['전체', '도장 홍보', '일반 게시글']}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPage(1);
            }}
            searchQuery={searchQuery}
            setSearchQuery={(query) => {
              setSearchQuery(query);
              setPage(1);
            }}
            writeLink="/community/write"
          />
        </div>
      </div>

      <div
        style={{ paddingTop: `${headerHeight + 24}px` }}
        className="pb-6 flex justify-center"
      >
        <div className="w-full max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <Postcard
                  key={post.id}
                  post={{
                    ...post,
                    nickname: post.nickname ?? '알 수 없음',
                    avatar_url: post.avatar_url ?? '',
                    image_url: post.image_url ?? '',
                  }}
                />
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-lg">게시글이 없습니다</p>
                <p className="text-sm mt-2">첫 번째 게시글을 작성해보세요!</p>
              </div>
            )}
          </div>
          {hasMore && <div ref={observerRef} className="h-10" />}
        </div>
      </div>
    </main>
  );
}
