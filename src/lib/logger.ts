/**
 * Request logging and monitoring utilities
 */

import { NextRequest } from 'next/server'

export interface RequestLog {
  id: string
  method: string
  url: string
  path: string
  query: Record<string, string>
  headers: Record<string, string>
  ip: string | null
  userAgent: string | null
  timestamp: string
  duration?: number
  statusCode?: number
  error?: string
}

/**
 * Extract request information for logging
 */
export function extractRequestInfo(request: NextRequest): Omit<RequestLog, 'id' | 'timestamp'> {
  const url = request.nextUrl
  const headers: Record<string, string> = {}

  // Extract relevant headers
  const relevantHeaders = [
    'user-agent',
    'referer',
    'accept',
    'content-type',
    'x-forwarded-for',
    'x-real-ip',
  ]

  relevantHeaders.forEach((header) => {
    const value = request.headers.get(header)
    if (value) {
      headers[header] = value
    }
  })

  // Extract query parameters
  const query: Record<string, string> = {}
  url.searchParams.forEach((value, key) => {
    query[key] = value
  })

  // Get IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || null

  return {
    method: request.method,
    url: url.toString(),
    path: url.pathname,
    query,
    headers,
    ip,
    userAgent: request.headers.get('user-agent'),
  }
}

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Logger class
 */
class Logger {
  private logs: RequestLog[] = []
  private maxLogs: number = 1000

  /**
   * Log a request
   */
  log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString()

    if (process.env.NODE_ENV === 'development') {
      const prefix = `[${level}] ${timestamp}`
      console.log(prefix, message, data || '')
    }

    // Store in memory (for production, send to external service)
    if (this.logs.length >= this.maxLogs) {
      this.logs.shift()
    }

    this.logs.push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      method: 'LOG',
      url: message,
      path: message,
      query: {},
      headers: {},
      ip: null,
      userAgent: null,
      timestamp,
      statusCode: level === LogLevel.ERROR ? 500 : 200,
      ...data,
    })
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData = {
      ...data,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }
    this.log(LogLevel.ERROR, message, errorData)
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit: number = 100): RequestLog[] {
    return this.logs.slice(-limit)
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = []
  }
}

// Global logger instance
export const logger = new Logger()

/**
 * Measure execution time
 */
export async function measureTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<{ result: T; duration: number }> {
  const start = Date.now()
  const result = await fn()
  const duration = Date.now() - start

  logger.debug(`${label} completed`, { duration: `${duration}ms` })

  return { result, duration }
}

/**
 * Create a request timer
 */
export function createRequestTimer() {
  const start = Date.now()

  return {
    stop: () => Date.now() - start,
  }
}

/**
 * Log API request
 */
export function logApiRequest(
  request: NextRequest,
  statusCode: number,
  duration: number,
  error?: string
): void {
  const info = extractRequestInfo(request)
  const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO

  logger.log(level, `${info.method} ${info.path}`, {
    ...info,
    statusCode,
    duration: `${duration}ms`,
    error,
  })
}
