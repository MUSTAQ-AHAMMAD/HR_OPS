import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiError, handleApiError } from '@/lib/api-utils'
import { exportData as performExport, prepareDataForExport, createDownloadResponse, ExportFormat } from '@/lib/export'

/**
 * GET /api/brands/export
 * Export brands data in CSV, Excel, or JSON format
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = (searchParams.get('format') || 'csv') as ExportFormat
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Validate format
    if (!['csv', 'xlsx', 'json'].includes(format)) {
      return apiError('Invalid export format. Use csv, xlsx, or json', 400)
    }

    // Fetch brands
    const brands = await prisma.brand.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            templates: true,
            assets: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Prepare data for export
    const dataToExport = prepareDataForExport(
      brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        description: brand.description,
        primaryColor: brand.primaryColor,
        secondaryColor: brand.secondaryColor,
        isActive: brand.isActive,
        templatesCount: brand._count.templates,
        assetsCount: brand._count.assets,
        createdBy: brand.createdBy.name,
        createdByEmail: brand.createdBy.email,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
      })),
      ['logo'] // Exclude logo URLs from export
    )

    // Generate export
    const exported = performExport(
      dataToExport,
      format,
      `brands-export-${new Date().toISOString().split('T')[0]}.${format}`
    )

    return createDownloadResponse(exported.content, exported.filename, exported.mimeType)
  } catch (error) {
    return handleApiError(error)
  }
}
