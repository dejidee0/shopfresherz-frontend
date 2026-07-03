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
    <div className={cn('bg-[#141414] rounded-[12px] border-[0.5px] border-white/[0.08] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)]', className)}>
      {title && (
        <div className="px-6 py-4 border-b border-white/[0.08]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-6 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap',
                    alignClass[col.align ?? 'left']
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F5F5F5]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-[#6B7280]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={String(row[rowKey])}
                  className="hover:bg-white/[0.04] transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        'px-6 py-4 text-white whitespace-nowrap',
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
        <div className="px-6 py-4 border-t border-white/[0.08]">{footer}</div>
      )}
    </div>
  )
}
