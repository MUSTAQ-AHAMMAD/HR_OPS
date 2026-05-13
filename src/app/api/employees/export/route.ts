import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiError, handleApiError } from '@/lib/api-utils'
import { exportData as performExport, prepareDataForExport, createDownloadResponse, ExportFormat } from '@/lib/export'

/**
 * GET /api/employees/export
 * Export employees data in CSV, Excel, or JSON format
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = (searchParams.get('format') || 'csv') as ExportFormat
    const includeInactive = searchParams.get('includeInactive') === 'true'
    const department = searchParams.get('department')

    // Validate format
    if (!['csv', 'xlsx', 'json'].includes(format)) {
      return apiError('Invalid export format. Use csv, xlsx, or json', 400)
    }

    // Build where clause
    const where: Record<string, unknown> = {}
    if (!includeInactive) {
      where.isActive = true
    }
    if (department) {
      where.department = department
    }

    // Fetch employees
    const employees = await prisma.employee.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { lastName: 'asc' },
    })

    // Prepare data for export
    const dataToExport = prepareDataForExport(
      employees.map((emp) => ({
        id: emp.id,
        email: emp.email,
        firstName: emp.firstName,
        lastName: emp.lastName,
        displayName: emp.displayName,
        jobTitle: emp.jobTitle,
        department: emp.department,
        officeLocation: emp.officeLocation,
        phoneNumber: emp.phoneNumber,
        isActive: emp.isActive,
        syncedAt: emp.syncedAt,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt,
      })),
      ['avatar', 'metadata'] // Exclude avatar URLs and metadata from export
    )

    // Generate export
    const exported = performExport(
      dataToExport,
      format,
      `employees-export-${new Date().toISOString().split('T')[0]}.${format}`
    )

    return createDownloadResponse(exported.content, exported.filename, exported.mimeType)
  } catch (error) {
    return handleApiError(error)
  }
}
