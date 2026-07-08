import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/format'

export interface ColumnDef<T> {
  key: keyof T | string
  header: string
  align?: 'left' | 'right' | 'center'
  render?: (row: T) => ReactNode
}

interface DataTableProps<T> {
  title?: string
  columns: ColumnDef<T>[]
  data: T[]
  rowKey: keyof T
  className?: string
  emptyMessage?: string
  footer?: ReactNode
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}

export function DataTable<T>({
  title,
  columns,
  data,
  rowKey,
  className,
  emptyMessage = 'No data available',
  footer,
}: DataTableProps<T>) {
  return (
    <div className={cn('bg-[#FFFFFF] rounded-[12px] border-[0.5px] border-[rgba(0,0,0,0.07)] shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.06)]', className)}>
      {title && (
        <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.07)]">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F8] border-b border-[rgba(0,0,0,0.07)]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-6 py-3 text-xs font-bold text-[#111111] uppercase tracking-wider whitespace-nowrap',
                    alignClass[col.align ?? 'left']
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[rgba(0,0,0,0.07)]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-[#888888]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={String(row[rowKey])}
                  className="hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        'px-6 py-4 text-[#111111] whitespace-nowrap',
                        alignClass[col.align ?? 'left']
                      )}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.07)]">{footer}</div>
      )}
    </div>
  )
}
