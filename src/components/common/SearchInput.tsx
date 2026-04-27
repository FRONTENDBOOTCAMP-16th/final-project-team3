'use client';
import Image from 'next/image';
import { Input } from '../ui/input';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export default function SearchInput({
  searchQuery,
  setSearchQuery,
  onSearch,
  placeholder = '게시글 검색...',
}: SearchInputProps) {
  return (
    <div className="flex-1 relative flex items-center">
      <button className="absolute left-3 z-10" onClick={onSearch}>
        <Image src="/glasses.svg" alt="검색" width={18} height={18} />
      </button>
      <Input
        placeholder={placeholder}
        aria-label="검색"
        className="pl-9 flex-1 h-12 bg-input-bg"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
