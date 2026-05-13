import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { employeeSchema } from '@/lib/validations'
import { apiResponse, apiError, handleApiError, validateRequestBody, getQueryParams } from '@/lib/api-utils'

/**
 * GET /api/employees
 * Get all employees with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const page = parseInt(params.page ?? '1')
    const limit = parseInt(params.limit ?? '10')
    const skip = (page - 1) * limit
    const department = params.department
    const search = params.search

    const where: {
      isActive: boolean
      department?: string
      OR?: Array<{
        firstName?: { contains: string; mode: 'insensitive' }
        lastName?: { contains: string; mode: 'insensitive' }
        email?: { contains: string; mode: 'insensitive' }
      }>
    } = { isActive: true }

    if (department) where.department = department
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
      }),
      prisma.employee.count({ where }),
    ])

    return apiResponse({
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/employees
 * Create or update employee from sync
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      email: string
      firstName: string
      lastName: string
      displayName?: string
      jobTitle?: string
      department?: string
      officeLocation?: string
      phoneNumber?: string
      avatar?: string
      metadata?: Record<string, unknown>
    }>(request)

    if (!body) {
      return apiError('Invalid request body', 400)
    }

    // Validate employee data
    const validation = employeeSchema.safeParse(body)
    if (!validation.success) {
      return apiError('Validation failed', 400, validation.error.errors)
    }

    // Upsert employee
    const employee = await prisma.employee.upsert({
      where: { email: body.email },
      update: {
        firstName: body.firstName,
        lastName: body.lastName,
        displayName: body.displayName,
        jobTitle: body.jobTitle,
        department: body.department,
        officeLocation: body.officeLocation,
        phoneNumber: body.phoneNumber,
        avatar: body.avatar,
        metadata: body.metadata as any,
        syncedAt: new Date(),
      },
      create: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        displayName: body.displayName,
        jobTitle: body.jobTitle,
        department: body.department,
        officeLocation: body.officeLocation,
        phoneNumber: body.phoneNumber,
        avatar: body.avatar,
        metadata: body.metadata as any,
      },
    })

    return apiResponse({ employee }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
