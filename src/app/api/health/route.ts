import { NextRequest } from 'next/server'
import { apiResponse, apiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/health
 * Health check endpoint to verify service status
 */
export async function GET(_request: NextRequest) {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {} as Record<string, { status: string; message?: string }>,
    }

    // Check database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`
      checks.services.database = { status: 'healthy' }
    } catch (error) {
      checks.services.database = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Database connection failed',
      }
      checks.status = 'degraded'
    }

    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
    ]

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    if (missingEnvVars.length > 0) {
      checks.services.configuration = {
        status: 'warning',
        message: `Missing environment variables: ${missingEnvVars.join(', ')}`,
      }
      if (checks.status === 'healthy') {
        checks.status = 'degraded'
      }
    } else {
      checks.services.configuration = { status: 'healthy' }
    }

    // Check optional external services
    if (process.env.OPENAI_API_KEY) {
      checks.services.openai = { status: 'configured' }
    } else {
      checks.services.openai = { status: 'not_configured' }
    }

    if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_TENANT_ID) {
      checks.services.azure = { status: 'configured' }
    } else {
      checks.services.azure = { status: 'not_configured' }
    }

    const statusCode = checks.status === 'healthy' ? 200 : 503

    return apiResponse(checks, statusCode)
  } catch (error) {
    return apiError(
      'Health check failed',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
