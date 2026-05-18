'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchInput from '../common/SearchInput';
import { supabase } from '@/lib/supabase/client';

interface PageheaderProps {
  title: string;
  description: string;
  tabs?: string[];
  activeTab?: string;
  // eslint-disable-next-line no-unused-vars
  setActiveTab?: (tab: string) => void;
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
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
    if (writeLink) {
      router.push(writeLink);
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-white z-10 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
        <p className="text-sm text-text-secondary" aria-label={description}>
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2" role="search">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={onSearch}
          placeholder={searchPlaceholder ?? '게시글 검색...'}
        />
        {writeLink && (
          <Button
            asChild
            className="bg-btn-focus text-btn-focus-text shrink-0 w-31 h-12 flex items-center gap-2 cursor-pointer"
          >
            <Link
              href={writeLink}
              onClick={handleWriteClick}
              aria-label={`${writeLinkText ?? '글쓰기'} 페이지로 이동`}
            >
              <Image
                src="/Plusicon.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
              />
              {writeLinkText ?? '글쓰기'}
            </Link>
          </Button>
        )}
      </div>

      {tabs && tabs.length > 0 && (
        <div
          className="flex gap-2"
          role="tablist"
          aria-label={`${title} 카테고리 탭`}
        >
          {tabs.map((tab) => (
            <Button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`tabpanel-${tab}`}
              onClick={() => setActiveTab && setActiveTab(tab)}
              className={`cursor-pointer ${
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
    </div>
  );
}
