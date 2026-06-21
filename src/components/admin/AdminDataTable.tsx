'use client';

import { useAdminTablePagination } from '@/hooks/useAdminTablePagination';
import AdminTablePagination from '@/components/admin/AdminTablePagination';
import { cn } from '@/lib/utils';

export interface AdminTableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  align?: 'left' | 'center';
  truncate?: boolean;
  render?: (_row: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  caption?: string;
  initialPageSize?: number;
  pageSizeOptions?: readonly number[];
  currentPage?: number;
  totalItems?: number;
  serverPagination?: boolean;
  isLoading?: boolean;
  onPageChange?: (_page: number) => void;
  getRowKey?: (_row: T, _index: number) => React.Key;
}

export default function AdminDataTable<T>({
  columns,
  data,
  emptyMessage = '데이터가 없습니다.',
  caption,
  initialPageSize,
  pageSizeOptions,
  currentPage,
  totalItems,
  serverPagination,
  isLoading = false,
  onPageChange,
  getRowKey,
}: AdminDataTableProps<T>) {
  const {
    pageSize,
    currentPage: safeCurrentPage,
    totalItems: resolvedTotalItems,
    totalPages,
    paginatedData,
    pageSizeOptions: normalizedPageSizeOptions,
    handlePageChange,
    handlePageSizeChange,
  } = useAdminTablePagination({
    data,
    initialPageSize,
    pageSizeOptions,
    currentPage,
    totalItems,
    serverPagination,
    onPageChange,
  });

  return (
    <section
      className="relative w-full max-w-7xl rounded-md px-6 py-4 mb-8"
      style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
      aria-busy={isLoading}
    >
      <table
        className={cn(
          'w-full table-fixed border-collapse transition-opacity duration-150',
          isLoading && 'opacity-45',
        )}
        style={{ background: 'var(--color-bg-surface)' }}
        aria-label={caption}
      >
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className={cn(
                  'px-4 py-3 text-sm font-semibold',
                  column.align === 'center' && 'text-center',
                  column.align === 'left' && 'text-left',
                )}
                style={{
                  borderBottom: '1px solid var(--color-border-medium)',
                  color: 'var(--color-text-secondary)',
                  background: 'var(--color-bg-tint)',
                  width: column.width,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm"
                style={{ color: 'var(--color-text-disabled)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const originalIndex = (safeCurrentPage - 1) * pageSize + rowIndex;

              return (
                <tr
                  key={
                    getRowKey ? getRowKey(row, originalIndex) : originalIndex
                  }
                  className="group transition-colors duration-200 hover:bg-[var(--color-table-top)]"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        'px-4 py-3 text-sm',
                        column.align === 'center' && 'text-center',
                        column.align === 'left' && 'text-left',
                      )}
                      style={{
                        borderBottom: '1px solid var(--color-bg-tint)',
                        color: 'var(--color-text-high)',
                      }}
                    >
                      <div
                        className={
                          column.truncate === false
                            ? 'whitespace-normal'
                            : 'truncate'
                        }
                      >
                        {column.render
                          ? column.render(row)
                          : String(row[column.key])}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <AdminTablePagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={resolvedTotalItems}
        pageSize={pageSize}
        pageSizeOptions={normalizedPageSizeOptions}
        showPageSizeSelector={!serverPagination}
        disabled={isLoading}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {isLoading ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-md backdrop-blur-[1px]"
          style={{ background: 'var(--color-overlay)' }}
          role="status"
          aria-live="polite"
        >
          <div
            className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium"
            style={{ background: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-medium)', color: 'var(--color-text-high)' }}
          >
            <span
              className="size-5 rounded-full border-2 border-zinc-200 border-t-btn-focus animate-spin"
              aria-hidden="true"
            />
            데이터를 불러오는 중입니다
          </div>
        </div>
      ) : null}
    </section>
  );
}
