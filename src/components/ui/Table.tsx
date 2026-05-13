import React from 'react'
import { cn } from '@/lib/utils'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('border-b border-secondary-200 dark:border-secondary-700', className)} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-b border-secondary-200 transition-colors hover:bg-secondary-50 dark:border-secondary-700 dark:hover:bg-secondary-800/50',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left align-middle font-medium text-secondary-700 dark:text-secondary-300',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 align-middle text-secondary-900 dark:text-secondary-100', className)} {...props}>
      {children}
    </td>
  )
}
