import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, handleApiError } from '@/lib/api-utils'

/**
 * GET /api/dashboard/stats
 * Get comprehensive dashboard statistics
 */
export async function GET(_request: NextRequest) {
  try {
    // Get counts in parallel
    const [
      totalBrands,
      activeBrands,
      totalTemplates,
      publishedTemplates,
      draftTemplates,
      totalEmployees,
      activeEmployees,
      recentActivity,
      topDepartments,
      templatesByStatus,
      brandsByMonth,
    ] = await Promise.all([
      // Brand stats
      prisma.brand.count(),
      prisma.brand.count({ where: { isActive: true } }),

      // Template stats
      prisma.template.count(),
      prisma.template.count({ where: { status: 'PUBLISHED' } }),
      prisma.template.count({ where: { status: 'DRAFT' } }),

      // Employee stats
      prisma.employee.count(),
      prisma.employee.count({ where: { isActive: true } }),

      // Recent activity (last 10)
      prisma.activityLog.findMany({
        take: 10,
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

      // Top 5 departments by employee count
      prisma.employee.groupBy({
        by: ['department'],
        _count: {
          department: true,
        },
        where: {
          isActive: true,
          department: { not: null },
        },
        orderBy: {
          _count: {
            department: 'desc',
          },
        },
        take: 5,
      }),

      // Templates by status
      prisma.template.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),

      // Brands created per month (last 6 months)
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as count
        FROM brands
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `,
    ])

    // Calculate trends (compare with last period)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [newBrandsThisMonth, newTemplatesThisMonth, newEmployeesThisMonth] = await Promise.all([
      prisma.brand.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.template.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.employee.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ])

    return apiResponse({
      overview: {
        brands: {
          total: totalBrands,
          active: activeBrands,
          inactive: totalBrands - activeBrands,
          newThisMonth: newBrandsThisMonth,
        },
        templates: {
          total: totalTemplates,
          published: publishedTemplates,
          draft: draftTemplates,
          archived: totalTemplates - publishedTemplates - draftTemplates,
          newThisMonth: newTemplatesThisMonth,
        },
        employees: {
          total: totalEmployees,
          active: activeEmployees,
          inactive: totalEmployees - activeEmployees,
          newThisMonth: newEmployeesThisMonth,
        },
      },
      recentActivity: recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId,
        user: log.user?.name || 'Unknown',
        userEmail: log.user?.email || '',
        createdAt: log.createdAt,
      })),
      topDepartments: topDepartments.map((dept) => ({
        department: dept.department,
        employeeCount: dept._count.department,
      })),
      templatesByStatus: templatesByStatus.map((t) => ({
        status: t.status,
        count: t._count.status,
      })),
      brandsTrend: brandsByMonth,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
