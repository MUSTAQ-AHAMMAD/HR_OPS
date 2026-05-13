import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ children, className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300',
    success: 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400',
    warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400',
    error: 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400',
    info: 'bg-info-100 text-info-700 dark:bg-info-900/20 dark:text-info-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
