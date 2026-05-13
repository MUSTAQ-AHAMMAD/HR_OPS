import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, handleApiError, validateRequestBody } from '@/lib/api-utils'

/**
 * POST /api/templates/bulk
 * Perform bulk operations on templates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      operation: 'publish' | 'archive' | 'draft' | 'delete'
      ids: string[]
    }>(request)

    if (!body || !body.operation || !Array.isArray(body.ids) || body.ids.length === 0) {
      return apiError('Invalid request body. Must include operation and ids array', 400)
    }

    const { operation, ids } = body

    let result
    let status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

    switch (operation) {
      case 'publish':
        status = 'PUBLISHED'
        break
      case 'archive':
        status = 'ARCHIVED'
        break
      case 'draft':
        status = 'DRAFT'
        break
      case 'delete':
        status = 'ARCHIVED'
        break
      default:
        return apiError(`Invalid operation: ${operation}`, 400)
    }

    result = await prisma.template.updateMany({
      where: { id: { in: ids } },
      data: { status },
    })

    return apiResponse({
      message: `Bulk ${operation} completed successfully`,
      count: result.count,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
