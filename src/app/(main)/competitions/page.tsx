'use client';
import { useState, useRef, useEffect } from 'react';
import Pageheader from '@/src/components/layout/PageHeader';
import CompetitionCard from '@/src/components/competition/CompetitionCard';
import { useDebounce } from '@/src/hooks/useDebounce';
import { useUserRole } from '../../../hooks/useUserRole';
import LoadingSpinner from '@/src/components/common/LoadingSpinner';
import { useCompetiton } from '@/src/hooks/useCompetition';

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  // const userRole = useUserRole();
  const userRole: string = 'admin'; // 임시 테스트용
  const { data, isLoading } = useCompetiton();

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const filteredCompetitions = (data ?? []).filter((competition) => {
    const matchTab = activeTab === '전체' || competition.status === activeTab;
    const matchSearch = competition.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    return matchTab && matchSearch;
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
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            writeLink={
              userRole === 'manager' || userRole === 'admin'
                ? '/competitions/write'
                : undefined
            }
            writeLinkText="일정추가"
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
            ) : filteredCompetitions.length > 0 ? (
              filteredCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-lg">대회 일정이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
