'use client';

import type { AdminFilterOption } from '@/src/constants/adminPostFilters';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

interface AdminTableToolbarProps {
  filters: AdminFilterOption[];
}

export default function AdminTableToolbar({ filters }: AdminTableToolbarProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0]?.value ?? 'all');

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
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'rounded-md border px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200',
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
      </div>
    </section>
  );
}
