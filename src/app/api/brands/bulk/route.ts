import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, handleApiError, validateRequestBody } from '@/lib/api-utils'

/**
 * POST /api/brands/bulk
 * Perform bulk operations on brands
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      operation: 'activate' | 'deactivate' | 'delete'
      ids: string[]
    }>(request)

    if (!body || !body.operation || !Array.isArray(body.ids) || body.ids.length === 0) {
      return apiError('Invalid request body. Must include operation and ids array', 400)
    }

    const { operation, ids } = body

    let result

    switch (operation) {
      case 'activate':
        result = await prisma.brand.updateMany({
          where: { id: { in: ids } },
          data: { isActive: true },
        })
        break

      case 'deactivate':
        result = await prisma.brand.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        })
        break

      case 'delete':
        // Soft delete by deactivating
        result = await prisma.brand.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        })
        break

      default:
        return apiError(`Invalid operation: ${operation}`, 400)
    }

    return apiResponse({
      message: `Bulk ${operation} completed successfully`,
      count: result.count,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
