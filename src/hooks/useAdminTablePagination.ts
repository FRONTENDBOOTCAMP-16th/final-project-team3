import { useMemo, useState } from 'react';

interface UseTablePaginationParams<T> {
  data: T[];
  initialPageSize?: number;
  pageSizeOptions?: readonly number[];
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export function useAdminTablePagination<T>({
  data,
  initialPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: UseTablePaginationParams<T>) {
  const normalizedPageSizeOptions = useMemo(() => {
    const mergedOptions = new Set<number>([
      ...pageSizeOptions.filter((option) => option > 0),
      initialPageSize > 0 ? initialPageSize : DEFAULT_PAGE_SIZE,
    ]);

    return Array.from(mergedOptions).sort((left, right) => left - right);
  }, [initialPageSize, pageSizeOptions]);

  const [pageSize, setPageSize] = useState(
    initialPageSize > 0 ? initialPageSize : DEFAULT_PAGE_SIZE,
  );

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return data.slice(startIndex, endIndex);
  }, [data, pageSize, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    const clampedPage = Math.min(Math.max(page, 1), totalPages);

    setCurrentPage(clampedPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  };

  return {
    pageSize,
    currentPage: safeCurrentPage,
    totalPages,
    paginatedData,
    pageSizeOptions: normalizedPageSizeOptions,
    handlePageChange,
    handlePageSizeChange,
  };
}
