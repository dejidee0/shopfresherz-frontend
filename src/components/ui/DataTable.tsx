// components/ui/DataTable.tsx
import { ReactNode } from "react";

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: keyof T;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  title,
  columns,
  data,
  rowKey,
  className = "",
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const alignClass = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-6 shadow-sm ${className}`}>
      {title && <h3 className="font-bold text-gray-900 mb-4">{title}</h3>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`pb-3 px-3 md:px-0 ${alignClass[col.align ?? "left"]}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={String(row[rowKey])}
                  className="border-y border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`py-3 px-3 md:px-0 text-gray-600 ${alignClass[col.align ?? "left"]}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}