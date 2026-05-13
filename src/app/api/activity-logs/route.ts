import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, handleApiError } from '@/lib/api-utils'
import {
  getPaginationParams,
  createPaginationMeta,
  buildOrderBy,
  buildDateRangeFilter,
  combineWhereConditions,
} from '@/lib/pagination'

/**
 * GET /api/activity-logs
 * Get activity logs with pagination, filtering, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Pagination
    const { skip, take, page, limit } = getPaginationParams(searchParams)

    // Filters
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const resource = searchParams.get('resource')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause
    const whereConditions: Record<string, unknown>[] = []

    if (userId) {
      whereConditions.push({ userId })
    }

    if (action) {
      whereConditions.push({ action })
    }

    if (resource) {
      whereConditions.push({ resource })
    }

    const dateFilter = buildDateRangeFilter(startDate, endDate, 'createdAt')
    if (dateFilter) {
      whereConditions.push(dateFilter)
    }

    const where = combineWhereConditions(...whereConditions)

    // Fetch logs with pagination
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take,
        orderBy: buildOrderBy('createdAt', 'desc'),
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.activityLog.count({ where }),
    ])

    const pagination = createPaginationMeta(page, limit, total)

    return apiResponse({
      logs,
      pagination,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
