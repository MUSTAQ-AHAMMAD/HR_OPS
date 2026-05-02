'use client'

import React from 'react'
import { Toaster } from 'react-hot-toast'

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-secondary-800)',
            color: 'var(--color-secondary-50)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-md)',
            fontSize: 'var(--font-size-sm)',
            boxShadow: 'var(--shadow-lg)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success-500)',
              secondary: 'var(--color-secondary-50)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error-500)',
              secondary: 'var(--color-secondary-50)',
            },
          },
        }}
      />
    </>
  )
}

// Toast utility functions
export { toast } from 'react-hot-toast'
