'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'avatar' | 'card' | 'default'
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const baseClasses = 'skeleton'

  const variantClasses = {
    text: 'skeleton-text',
    avatar: 'skeleton-avatar',
    card: 'skeleton-card',
    default: 'h-4 rounded',
  }

  return <div className={cn(baseClasses, variantClasses[variant], className)} />
}

/**
 * Skeleton loading components for different layouts
 */
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-secondary-200 bg-white p-6 dark:border-secondary-700 dark:bg-secondary-800">
      <div className="flex items-start gap-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-secondary-200 bg-white p-4 dark:border-secondary-700 dark:bg-secondary-800">
          <Skeleton variant="avatar" className="h-8 w-8" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
