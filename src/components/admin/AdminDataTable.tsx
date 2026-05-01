export interface AdminTableColumn<T> {
  key: keyof T;
  header: string;
  // eslint-disable-next-line no-unused-vars
  render?: (_row: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  // eslint-disable-next-line no-unused-vars
  getRowKey?: (_row: T, _index: number) => React.Key;
}

export default function AdminDataTable<T>({
  columns,
  data,
  getRowKey,
}: AdminDataTableProps<T>) {
  return (
    <section className="w-full max-w-7xl px-6 py-4 bg-white border rounded-md">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="border-b px-4 py-3 text-left text-sm font-semibold"
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
                게시글이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
                className="group transition-colors duration-200 hover:bg-[var(--color-table-top)]"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="border-b px-4 py-3 text-sm text-zinc-700"
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
