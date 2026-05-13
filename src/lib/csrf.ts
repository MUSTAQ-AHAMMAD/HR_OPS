import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'

const CSRF_TOKEN_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a new CSRF token and set it in cookies
 */
export async function generateCsrfToken(): Promise<string> {
  const token = nanoid(32)
  const cookieStore = await cookies()

  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return token
}

/**
 * Verify CSRF token from request
 */
export async function verifyCsrfToken(headerToken: string | null): Promise<boolean> {
  if (!headerToken) {
    return false
  }

  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value

  if (!cookieToken) {
    return false
  }

  return cookieToken === headerToken
}

/**
 * Get CSRF token from cookies
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_NAME)?.value
}

/**
 * Middleware helper to check CSRF token
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  // Only check CSRF for state-changing methods
  const method = request.method
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return true
  }

  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  return await verifyCsrfToken(headerToken)
}

export { CSRF_TOKEN_NAME, CSRF_HEADER_NAME }
