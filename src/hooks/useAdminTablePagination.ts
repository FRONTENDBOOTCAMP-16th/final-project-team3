import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseTablePaginationParams<T> {
  data: T[];
  initialPageSize?: number;
  pageSizeOptions?: readonly number[];
  currentPage?: number;
  totalItems?: number;
  serverPagination?: boolean;
  // eslint-disable-next-line no-unused-vars
  onPageChange?: (_page: number) => void;
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export function useAdminTablePagination<T>({
  data,
  initialPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  currentPage,
  totalItems,
  serverPagination = false,
  onPageChange,
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

  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const resolvedCurrentPage = currentPage ?? internalCurrentPage;

  const totalItemCount = serverPagination ? (totalItems ?? data.length) : data.length;
  const totalPages = Math.max(1, Math.ceil(totalItemCount / pageSize));
  const safeCurrentPage = Math.min(resolvedCurrentPage, totalPages);

  useEffect(() => {
    if (!onPageChange || safeCurrentPage === resolvedCurrentPage) {
      return;
    }

    onPageChange(safeCurrentPage);
  }, [onPageChange, resolvedCurrentPage, safeCurrentPage]);

  const paginatedData = useMemo(() => {
    if (serverPagination) {
      return data;
    }

    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return data.slice(startIndex, endIndex);
  }, [data, pageSize, safeCurrentPage, serverPagination]);

  const handlePageChange = useCallback(
    (page: number) => {
      const clampedPage = Math.min(Math.max(page, 1), totalPages);

      if (onPageChange) {
        onPageChange(clampedPage);
        return;
      }

      setInternalCurrentPage(clampedPage);
    },
    [onPageChange, totalPages],
  );

  const handlePageSizeChange = useCallback(
    (nextPageSize: number) => {
      setPageSize(nextPageSize);
      handlePageChange(1);
    },
    [handlePageChange],
  );

  return {
    pageSize,
    currentPage: safeCurrentPage,
    totalItems: totalItemCount,
    totalPages,
    paginatedData,
    pageSizeOptions: normalizedPageSizeOptions,
    handlePageChange,
    handlePageSizeChange,
  };
}
