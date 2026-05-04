'use client';

import { useAdminTablePagination } from '@/hooks/useAdminTablePagination';
import AdminTablePagination from '@/components/admin/AdminTablePagination';
import { cn } from '@/lib/utils';

export interface AdminTableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  align?: 'left' | 'center';
  // eslint-disable-next-line no-unused-vars
  render?: (_row: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  initialPageSize?: number;
  pageSizeOptions?: readonly number[];
  // eslint-disable-next-line no-unused-vars
  getRowKey?: (_row: T, _index: number) => React.Key;
}

export default function AdminDataTable<T>({
  columns,
  data,
  emptyMessage = '데이터가 없습니다.',
  initialPageSize,
  pageSizeOptions,
  getRowKey,
}: AdminDataTableProps<T>) {
  const {
    pageSize,
    currentPage,
    totalPages,
    paginatedData,
    pageSizeOptions: normalizedPageSizeOptions,
    handlePageChange,
    handlePageSizeChange,
  } = useAdminTablePagination({
    data,
    initialPageSize,
    pageSizeOptions,
  });

  return (
    <section className="w-full max-w-7xl rounded-md border bg-white px-6 py-4 mb-8">
      <table className="w-full table-fixed border-collapse bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  'border-b px-4 py-3 text-sm font-semibold',
                  column.align === 'center' && 'text-center',
                  column.align === 'left' && 'text-left',
                )}
                style={{ width: column.width }}
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
                className="px-4 py-10 text-center text-sm text-zinc-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const originalIndex = (currentPage - 1) * pageSize + rowIndex;

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
                        'border-b px-4 py-3 text-sm text-zinc-700',
                        column.align === 'center' && 'text-center',
                        column.align === 'left' && 'text-left',
                      )}
                    >
                      <div className="truncate">
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
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data.length}
        pageSize={pageSize}
        pageSizeOptions={normalizedPageSizeOptions}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </section>
  );
}
