'use client'

import React, { Component, ReactNode, ErrorInfo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-secondary-50 p-4 dark:bg-secondary-900">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-secondary-800">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-error-50 p-3 dark:bg-error-900/20">
                <AlertTriangle className="h-8 w-8 text-error-500" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                Something went wrong
              </h1>
              <p className="mb-6 text-secondary-600 dark:text-secondary-400">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="primary">
                  Try again
                </Button>
                <Button onClick={() => (window.location.href = '/')} variant="secondary">
                  Go home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based error boundary wrapper
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
