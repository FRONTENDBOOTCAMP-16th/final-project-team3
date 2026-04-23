'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Link from 'next/link';

interface PageheaderProps {
  title: string;
  description: string;
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  writeLink?: string;
}

export default function Pageheader({
  title,
  description,
  tabs,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  writeLink,
}: PageheaderProps) {
  return (
    <div className="flex flex-col gap-5 bg-white z-10 py-6">
      {/* 타이틀 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>

      {/* 검색창 + 글쓰기 버튼 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <button className="absolute left-3 z-10">
            <Image src="/glasses.svg" alt="검색" width={18} height={18} />
          </button>
          <Input
            placeholder="   게시글 검색..."
            className="pl-9 flex-1 h-12 bg-input-bg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {writeLink && (
          <Link href={writeLink}>
            <Button className="bg-btn-focus text-btn-focus-text shrink-0 w-31 h-12 flex items-center gap-2">
              <Image src="/Plusicon.svg" alt="글쓰기" width={16} height={16} />
              글쓰기
            </Button>
          </Link>
        )}
      </div>

      {/* 탭 버튼 */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${
              activeTab === tab
                ? 'bg-btn-focus text-btn-focus-text'
                : 'bg-btn-basic text-btn-text'
            } h-10 p-6`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* 구분선 */}
    </div>
  );
}
