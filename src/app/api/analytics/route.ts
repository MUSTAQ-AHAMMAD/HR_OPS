import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, handleApiError, getQueryParams } from '@/lib/api-utils'

/**
 * GET /api/analytics
 * Get usage statistics and analytics
 */
export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const startDate = params.startDate ? new Date(params.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = params.endDate ? new Date(params.endDate) : new Date()

    // Get counts
    const [
      totalUsers,
      totalBrands,
      totalTemplates,
      totalEmployees,
      recentActivities,
      templatesByCategory,
      usersByRole,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.brand.count({ where: { isActive: true } }),
      prisma.template.count(),
      prisma.employee.count({ where: { isActive: true } }),
      prisma.activityLog.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.template.groupBy({
        by: ['category'],
        _count: {
          id: true,
        },
        where: {
          category: {
            not: null,
          },
        },
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true,
        },
      }),
    ])

    // Activity trends
    const activityTrends = await prisma.activityLog.groupBy({
      by: ['action'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    return apiResponse({
      summary: {
        totalUsers,
        totalBrands,
        totalTemplates,
        totalEmployees,
      },
      charts: {
        templatesByCategory: templatesByCategory.map((item) => ({
          category: item.category ?? 'Uncategorized',
          count: item._count.id,
        })),
        usersByRole: usersByRole.map((item) => ({
          role: item.role,
          count: item._count.id,
        })),
        activityTrends: activityTrends.map((item) => ({
          action: item.action,
          count: item._count.id,
        })),
      },
      recentActivities: recentActivities.slice(0, 20),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
