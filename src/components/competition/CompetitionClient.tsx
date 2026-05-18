'use client';
import { useRef, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pageheader from '@/components/layout/PageHeader';
import CompetitionCard from '@/components/competition/CompetitionCard';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCompetiton } from '@/hooks/useCompetition';
import { useAuth } from '@/hooks/useAuth';
import { getStatus } from '@/utils/formatDate';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useState } from 'react';
import type { Competition } from '@/types/competition';

interface CompetitionClientProps {
  initialCompetitions: Competition[];
}

export default function CompetitionClient({
  initialCompetitions,
}: CompetitionClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? '전체';

  const [searchQuery, setSearchQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCompetiton(initialCompetitions);

  // 모든 페이지 데이터를 하나의 배열로 합치기
  const competitions = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data],
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
  };

  const filteredCompetitions = useMemo(
    () =>
      competitions
        .filter((competition) => {
          const matchTab =
            activeTab === '전체' ||
            getStatus(competition.apply_deadline) === activeTab;
          const matchSearch = competition.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase());
          return matchTab && matchSearch;
        })
        .sort((a, b) => {
          const statusA = getStatus(a.apply_deadline);
          const statusB = getStatus(b.apply_deadline);
          if (statusA === '모집완료' && statusB !== '모집완료') return 1;
          if (statusA !== '모집완료' && statusB === '모집완료') return -1;
          return (
            new Date(a.apply_deadline).getTime() -
            new Date(b.apply_deadline).getTime()
          );
        }),
    [competitions, activeTab, debouncedSearch],
  );

  const observerRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <div className="w-full min-h-screen">
      <div
        ref={headerRef}
        className="fixed top-0 left-50 right-0 z-10 bg-white shadow-md flex justify-center"
      >
        <div className="w-full max-w-7xl px-6">
          <Pageheader
            title="대회일정"
            description="전국 주짓수 대회 일정"
            tabs={['전체', '모집중', '마감임박', '모집완료']}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            writeLink={isAdmin ? '/competitions/write' : undefined}
            writeLinkText="일정추가"
          />
        </div>
      </div>

      <main
        style={{ paddingTop: `${headerHeight + 24}px` }}
        className="pb-6 flex justify-center"
        aria-label="대회일정 목록"
      >
        <div className="w-full max-w-7xl px-6">
          {isLoading ? (
            <div role="status" aria-label="대회 목록 불러오는 중">
              <LoadingSpinner />
            </div>
          ) : (
            <ul
              className="grid grid-cols-2 gap-4"
              aria-label={
                filteredCompetitions.length > 0
                  ? `대회 목록 ${filteredCompetitions.length}개`
                  : '대회 목록 없음'
              }
            >
              {filteredCompetitions.length > 0 ? (
                filteredCompetitions.map((competition) => (
                  <li key={competition.id} className="h-full">
                    <CompetitionCard competition={competition} />
                  </li>
                ))
              ) : (
                <li
                  className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-400"
                  aria-live="polite"
                >
                  <p className="text-lg">대회 일정이 없습니다</p>
                </li>
              )}
            </ul>
          )}

          {/* 무한스크롤 로딩 */}
          {hasNextPage && (
            <div
              ref={observerRef}
              className="h-20 flex items-center justify-center"
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
      </main>
    </div>
  );
}
