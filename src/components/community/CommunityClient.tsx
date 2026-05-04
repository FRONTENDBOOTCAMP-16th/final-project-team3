'use client';

import { useState, useRef, useEffect, startTransition, useMemo } from 'react';
import Pageheader from '@/components/layout/PageHeader';
import Postcard from '@/components/community/Postcard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce } from '@/hooks/useDebounce';
import { usePosts } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import type { Post } from '@/types/community';

const PAGE_SIZE = 10;

interface CommunityClientProps {
  initialPosts: Post[];
}

export default function CommunityClient({
  initialPosts,
}: CommunityClientProps) {
  // 1. 상태 선언 및 초기값 복원 (에러 해결 핵심: Lazy Initialization)
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('communityPage');
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });

  const [headerHeight, setHeaderHeight] = useState(160);
  const headerRef = useRef<HTMLDivElement>(null);
  const isScrollRestoredRef = useRef(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { user, loading } = useAuth();
  const { data: posts = initialPosts } = usePosts();

  // 헤더 높이 측정
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  // 페이지 번호 저장 (변경될 때마다 세션 업데이트)
  useEffect(() => {
    sessionStorage.setItem('communityPage', page.toString());
  }, [page]);

  // 필터링 로직 최적화
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

  const visiblePosts = filteredPosts.slice(0, page * PAGE_SIZE);
  const hasMore = visiblePosts.length < filteredPosts.length;

  // 2. 스크롤 위치 복원 로직
  useEffect(() => {
    const lastPostId = sessionStorage.getItem('lastPostId');

    // 이미 복원했거나 마지막 ID가 없으면 종료
    if (isScrollRestoredRef.current || !lastPostId) return;

    // 데이터가 충분히 로드되었는지 확인
    if (visiblePosts.length > 0) {
      const timer = setTimeout(() => {
        const el = document.getElementById(lastPostId);
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: 'instant' });
          sessionStorage.removeItem('lastPostId');
          isScrollRestoredRef.current = true; // 복원 완료 표시
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visiblePosts]);

  const observerRef = useInfiniteScroll(() => {
    if (hasMore) {
      startTransition(() => {
        setPage((prev) => prev + 1);
      });
    }
  });

  return (
    <main className="w-full min-h-screen">
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
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPage(1);
              window.scrollTo(0, 0); // 탭 변경 시 최상단으로
            }}
            searchQuery={searchQuery}
            setSearchQuery={(query) => {
              setSearchQuery(query);
              setPage(1);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <div
                  key={post.id}
                  id={post.id}
                  className="cursor-pointer"
                  onClick={() => sessionStorage.setItem('lastPostId', post.id)}
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
              <div className="col-span-full flex flex-col items-center justify-center py-40 text-gray-400 font-light">
                <p className="text-lg">조건에 맞는 게시글이 없습니다</p>
                <p className="text-sm mt-2">새로운 소식을 들려주세요!</p>
              </div>
            )}
          </div>

          {hasMore && (
            <div
              ref={observerRef}
              className="h-20 flex items-center justify-center"
            >
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
