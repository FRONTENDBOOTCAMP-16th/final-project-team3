'use client';
import { useState } from 'react';
import Pageheader from '@/src/components/layout/PageHeader';
import Postcard from '../../../components/community/Postcard';
import { dummyPosts } from '@/src/constants/dummyData';
import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll';
import { useDebounce } from '@/src/hooks/useDebounce';

const PAGE_SIZE = 10;

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300); // 0.3초 후 검색

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
    <div className="w-full px-6 py-6">
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

      <div className="grid grid-cols-2 gap-4 mt-4">
        {visiblePosts.map((post) => (
          <Postcard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && <div ref={observerRef} className="h-10" />}
    </div>
  );
}
