'use client';

import type {
  AdminPostFilterOption,
  AdminPostFilterValue,
} from '@/components/admin/post/types';
import SearchInput from '@/components/common/SearchInput';
import { cn } from '@/lib/utils';

interface AdminTableToolbarProps {
  filters: readonly AdminPostFilterOption[];
  activeFilter: AdminPostFilterValue;
  // eslint-disable-next-line no-unused-vars
  onFilterChange: (_value: AdminPostFilterValue) => void;
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
  onSearchQueryChange: (_value: string) => void;
}

export default function AdminTableToolbar({
  filters,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchQueryChange,
}: AdminTableToolbarProps) {
  return (
    <section
      className="w-full max-w-7xl px-6 py-4"
      aria-label="게시글 검색 및 필터"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onFilterChange(filter.value)}
                className={cn(
                  'h-12 min-w-[84px] cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-btn-focus text-btn-focus-text'
                    : 'bg-btn-bagic text-btn-text hover:bg-btn-focus hover:text-btn-focus-text',
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={onSearchQueryChange}
        />
      </div>
    </section>
  );
}
