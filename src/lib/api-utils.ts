import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * API Response helper
 */
export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

/**
 * API Error helper
 */
export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof Error) {
    return apiError(error.message, 500)
  }

  return apiError('An unexpected error occurred', 500)
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * In production, use Redis or a proper rate limiting solution
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  request: NextRequest,
  maxRequests = 100,
  windowMs = 15 * 60 * 1000
): boolean {
  const ip = request.ip ?? 'unknown'
  const now = Date.now()

  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (limit.count >= maxRequests) {
    return false
  }

  limit.count++
  return true
}

/**
 * Validate request body
 */
export async function validateRequestBody<T>(request: NextRequest): Promise<T | null> {
  try {
    const body = await request.json()
    return body as T
  } catch {
    return null
  }
}

/**
 * Extract query parameters
 */
export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return Object.fromEntries(searchParams.entries())
}

/**
 * Security headers
 */
export function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}
