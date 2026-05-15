'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right';

interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
  // eslint-disable-next-line no-unused-vars
  onPageSizeChange: (pageSize: number) => void;
}

const navigationButtonClass =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors duration-50 disabled:cursor-not-allowed disabled:opacity-40';

function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PaginationItem[] = [1];
  const middleStart = Math.max(2, currentPage - 1);
  const middleEnd = Math.min(totalPages - 1, currentPage + 1);

  if (middleStart > 2) {
    items.push('ellipsis-left');
  }

  for (let page = middleStart; page <= middleEnd; page += 1) {
    items.push(page);
  }

  if (middleEnd < totalPages - 1) {
    items.push('ellipsis-right');
  }

  items.push(totalPages);

  return items;
}

export default function AdminTablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: AdminTablePaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const visibleItems = buildPaginationItems(currentPage, totalPages);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <footer className="flex flex-col gap-4 border-t border-border px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-text-secondary">
          총 {totalItems}개 중 {startItem}-{endItem}개 표시
        </p>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          페이지당
          <select
            className="h-9 cursor-pointer rounded-md border border-border bg-bg-white px-3 text-sm text-text-primary outline-none transition-colors duration-200 focus:border-btn-focus"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}개
              </option>
            ))}
          </select>
        </label>
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="테이블 페이지 이동"
          className="flex items-center justify-between gap-2 sm:justify-end"
        >
          <button
            type="button"
            aria-label="이전 페이지"
            className={cn(
              navigationButtonClass,
              'cursor-pointer border-border bg-bg-white text-btn-text hover:bg-btn-basic',
            )}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-2">
            {visibleItems.map((item) => {
              if (typeof item !== 'number') {
                return (
                  <span
                    key={item}
                    className="inline-flex h-9 min-w-9 items-center justify-center text-text-secondary"
                  >
                    <MoreHorizontal className="size-4" />
                  </span>
                );
              }

              const isActive = item === currentPage;

              return (
                <button
                  key={item}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    navigationButtonClass,
                    'cursor-pointer',
                    isActive
                      ? 'border-btn-focus bg-btn-focus text-btn-focus-text'
                      : 'border-border bg-bg-white text-btn-text hover:bg-btn-basic',
                  )}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="다음 페이지"
            className={cn(
              navigationButtonClass,
              'cursor-pointer border-border bg-bg-white text-btn-text hover:bg-btn-basic',
            )}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      ) : null}
    </footer>
  );
}
