'use client';

import SearchInput from '@/components/common/SearchInput';
import { cn } from '@/lib/utils';

interface AdminTableToolbarProps<TFilter extends string> {
  filters: readonly {
    label: string;
    value: TFilter;
  }[];
  activeFilter: TFilter;
  // eslint-disable-next-line no-unused-vars
  onFilterChange: (_value: TFilter) => void;
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
  onSearchQueryChange: (_value: string) => void;
  onSearch?: () => void;
  searchPlaceholder?: string;
}

export default function AdminTableToolbar<TFilter extends string>({
  filters,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  searchPlaceholder,
}: AdminTableToolbarProps<TFilter>) {
  return (
    <section
      className="w-full max-w-7xl px-6 py-4"
      aria-label="데이터 검색 및 필터"
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
          onSearch={onSearch}
          placeholder={searchPlaceholder}
        />
      </div>
    </section>
  );
}
