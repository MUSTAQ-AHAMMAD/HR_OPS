'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Lock body scroll
    document.body.style.overflow = 'hidden'

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, closeOnEscape])

  if (!isOpen) return null

  const sizeClasses = {
    horizontal: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      full: 'w-full',
    },
    vertical: {
      sm: 'max-h-[30vh]',
      md: 'max-h-[50vh]',
      lg: 'max-h-[70vh]',
      full: 'h-full',
    },
  }

  const isHorizontal = position === 'left' || position === 'right'
  const isVertical = position === 'top' || position === 'bottom'

  const positionClasses = {
    left: 'left-0 top-0 bottom-0 animate-slide-in-from-left',
    right: 'right-0 top-0 bottom-0 animate-slide-in-from-right',
    top: 'top-0 left-0 right-0 animate-slide-in-from-top',
    bottom: 'bottom-0 left-0 right-0 animate-slide-in-from-bottom',
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const drawerContent = (
    <div
      className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
      aria-describedby={description ? 'drawer-description' : undefined}
    >
      <div
        ref={drawerRef}
        className={cn(
          'fixed flex flex-col bg-white shadow-xl dark:bg-secondary-800',
          positionClasses[position],
          isHorizontal && sizeClasses.horizontal[size],
          isVertical && sizeClasses.vertical[size]
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between border-b border-secondary-200 p-6 dark:border-secondary-700">
            <div>
              {title && (
                <h2
                  id="drawer-title"
                  className="text-xl font-semibold text-secondary-900 dark:text-secondary-50"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="drawer-description"
                  className="mt-1 text-sm text-secondary-600 dark:text-secondary-400"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 rounded-md p-1 text-secondary-400 transition-colors hover:bg-secondary-100 hover:text-secondary-600 focus-visible-ring dark:hover:bg-secondary-700 dark:hover:text-secondary-300"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">{children}</div>
      </div>
    </div>
  )

  return createPortal(drawerContent, document.body)
}

/**
 * Drawer Footer component for consistent button layouts
 */
interface DrawerFooterProps {
  children: React.ReactNode
  className?: string
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-secondary-200 px-6 py-4 dark:border-secondary-700',
        className
      )}
    >
      {children}
    </div>
  )
}
