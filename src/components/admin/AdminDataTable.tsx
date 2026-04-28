interface AdminTableColumn<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
}

export default function AdminDataTable<T>({
  columns,
  data,
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
                key={rowIndex}
                className="group transition-colors duration-200 hover:bg-[var(--color-btn-focus)]"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="border-b px-4 py-3 text-sm text-zinc-700 group-hover:text-[var(--color-btn-focus-text)]"
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
