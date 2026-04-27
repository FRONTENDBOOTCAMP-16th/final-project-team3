'use client';
import { useState, useRef, useEffect } from 'react';
import Pageheader from '@/src/components/layout/PageHeader';
import Postcard from '../../../components/community/Postcard';
import { dummyPosts } from '@/src/constants/dummyData';
import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll';
import { useDebounce } from '@/src/hooks/useDebounce';
import LoadingSpinner from '@/src/components/common/LoadingSpinner';

const PAGE_SIZE = 10;

export default function CommunityPage() {
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const filteredPosts = dummyPosts.filter((post) => {
    const matchTab = activeTab === '전체' || post.category === activeTab;
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
      {/* 헤더 fixed 고정 */}
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

      {/* 카드 영역 - 헤더 높이 자동 반영 */}
      <div
        style={{ paddingTop: `${headerHeight + 24}px` }}
        className="pb-6 flex justify-center"
      >
        <div className="w-full max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : visiblePosts.length > 0 ? (
              visiblePosts.map((post) => <Postcard key={post.id} post={post} />)
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
