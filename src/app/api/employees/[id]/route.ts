import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, handleApiError, validateRequestBody } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/employees/[id]
 * Get a single employee by ID
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const employee = await prisma.employee.findUnique({
      where: { id },
    })

    if (!employee) {
      return apiError('Employee not found', 404)
    }

    return apiResponse({ employee })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/employees/[id]
 * Update an employee
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const body = await validateRequestBody<{
      email?: string
      firstName?: string
      lastName?: string
      displayName?: string
      jobTitle?: string
      department?: string
      officeLocation?: string
      phoneNumber?: string
      mobileNumber?: string
      avatar?: string
      isActive?: boolean
      metadata?: Record<string, unknown>
    }>(request)

    if (!body) {
      return apiError('Invalid request body', 400)
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...body,
        syncedAt: new Date(),
      },
    })

    return apiResponse({ employee })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/employees/[id]
 * Delete an employee (soft delete by setting isActive to false)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.employee.update({
      where: { id },
      data: { isActive: false },
    })

    return apiResponse({ message: 'Employee deactivated successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
