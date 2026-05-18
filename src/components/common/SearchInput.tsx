'use client';
import Image from 'next/image';
import { KeyboardEvent } from 'react';
import { Input } from '../ui/input';

interface SearchInputProps {
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
  setSearchQuery: (_query: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  inputAriaLabel?: string;
}

export default function SearchInput({
  searchQuery,
  setSearchQuery,
  onSearch,
  placeholder = '게시글 검색...',
  inputAriaLabel = '검색어 입력',
}: SearchInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch) {
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
        className="pl-9 flex-1 h-12 bg-input-bg"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
