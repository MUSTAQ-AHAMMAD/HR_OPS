import { NextRequest } from 'next/server'
import { apiResponse } from '@/lib/api-utils'
import { generateCsrfToken } from '@/lib/csrf'

/**
 * GET /api/csrf
 * Get a CSRF token for form submissions
 */
export async function GET(_request: NextRequest) {
  const token = await generateCsrfToken()

  return apiResponse({
    token,
    message: 'CSRF token generated. Include this in X-CSRF-Token header for state-changing requests.',
  })
}
