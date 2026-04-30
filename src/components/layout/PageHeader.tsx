'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchInput from '../common/SearchInput';
import { supabase } from '@/lib/supabase';

interface PageheaderProps {
  title: string;
  description: string;
  tabs?: string[];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  writeLink?: string;
  writeLinkText?: string;
  onSearch?: () => void;
  searchPlaceholder?: string;
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
  onSearch,
  writeLinkText,
  searchPlaceholder,
}: PageheaderProps) {
  const router = useRouter();
  const handleWriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    // 로그인 됐으면 writeLink로 이동
    if (writeLink) {
      router.push(writeLink);
    }
  };
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
          <button className="absolute left-3 z-10" onClick={onSearch}>
            <Image src="/glasses.svg" alt="검색" width={18} height={18} />
          </button>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={onSearch}
            placeholder={searchPlaceholder ?? '게시글 검색...'}
          />
        </div>
        {writeLink && (
          <Link href={writeLink}>
            <Button
              className="bg-btn-focus text-btn-focus-text shrink-0 w-31 h-12 flex items-center gap-2"
              onClick={handleWriteClick}
              aria-label="새 게시글 작성"
            >
              <Image src="/Plusicon.svg" alt="글쓰기" width={16} height={16} />
              {writeLinkText ?? '글쓰기'}
            </Button>
          </Link>
        )}
      </div>

      {/* 탭 버튼 */}
      {tabs && tabs.length > 0 && (
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab && setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'bg-btn-focus text-btn-focus-text'
                  : 'bg-btn-basic text-btn-text hover:bg-gray-200'
              } h-10 p-6 transition-all duration-200`}
            >
              {tab}
            </Button>
          ))}
        </div>
      )}

      {/* 구분선 */}
    </div>
  );
}
