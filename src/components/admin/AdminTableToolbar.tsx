'use client';

import type { AdminFilterOption } from '@/constants/adminPostFilters';
import { cn } from '@/lib/utils';
import SearchInput from '@/components/common/SearchInput';

interface AdminTableToolbarProps {
  filters: readonly AdminFilterOption[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
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
                  'h-12 w-21 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-[var(--color-btn-focus)] text-[var(--color-btn-focus-text)]'
                    : 'bg-[var(--color-btn-basic)] text-[var(--color-btn-text)] hover:bg-[var(--color-btn-focus)] hover:text-[var(--color-btn-focus-text)]',
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