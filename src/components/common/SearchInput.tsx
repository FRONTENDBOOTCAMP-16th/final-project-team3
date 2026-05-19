'use client';
import Image from 'next/image';
import { KeyboardEvent } from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
  setSearchQuery: (_query: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  inputAriaLabel?: string;
  isPending?: boolean;
}

export default function SearchInput({
  searchQuery,
  setSearchQuery,
  onSearch,
  placeholder = '게시글 검색...',
  inputAriaLabel = '검색어 입력',
  isPending = false,
}: SearchInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch && !isPending) {
      onSearch();
    }
  };

  return (
    <div className="flex-1 relative flex items-center">
      <span
        className="pointer-events-none absolute left-3 z-10"
        aria-hidden="true"
      >
        <Image src="/glasses.svg" alt="검색" width={18} height={18} />
      </span>
      <Input
        placeholder={placeholder}
        aria-label={inputAriaLabel}
        className={cn('pl-9 flex-1 h-12 bg-input-bg', isPending && 'pr-10')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
      />
      {isPending ? (
        <span
          className="pointer-events-none absolute right-3 inline-flex items-center gap-2 text-xs font-medium text-text-secondary"
          role="status"
          aria-live="polite"
        >
          <span
            className={cn(
              'size-4 rounded-full border-2 border-zinc-200 border-t-btn-focus',
              'animate-spin',
            )}
            aria-hidden="true"
          />
          <span className="sr-only">검색 결과를 불러오는 중</span>
        </span>
      ) : null}
    </div>
  );
}
