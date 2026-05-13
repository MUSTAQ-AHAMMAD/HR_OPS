import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export function Card({ children, className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-secondary-200 bg-white shadow-sm dark:border-secondary-700 dark:bg-secondary-800',
        hover && 'transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-b border-secondary-200 px-6 py-4 dark:border-secondary-700', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-secondary-900 dark:text-secondary-50', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-secondary-600 dark:text-secondary-400', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-t border-secondary-200 px-6 py-4 dark:border-secondary-700', className)} {...props}>
      {children}
    </div>
  )
}
