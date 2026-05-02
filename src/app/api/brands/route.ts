import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { brandSchema } from '@/lib/validations'
import { apiResponse, apiError, handleApiError, validateRequestBody, getQueryParams } from '@/lib/api-utils'

/**
 * GET /api/brands
 * Get all brands with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const page = parseInt(params.page ?? '1')
    const limit = parseInt(params.limit ?? '10')
    const skip = (page - 1) * limit

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where: { isActive: true },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              assets: true,
              templates: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.brand.count({ where: { isActive: true } }),
    ])

    return apiResponse({
      brands,
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
 * POST /api/brands
 * Create a new brand
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      name: string
      description?: string
      primaryColor?: string
      secondaryColor?: string
      logo?: string
      createdById: string
    }>(request)

    if (!body) {
      return apiError('Invalid request body', 400)
    }

    // Validate brand data
    const validation = brandSchema.safeParse(body)
    if (!validation.success) {
      return apiError('Validation failed', 400, validation.error.errors)
    }

    // Create brand
    const brand = await prisma.brand.create({
      data: {
        name: body.name,
        description: body.description,
        primaryColor: body.primaryColor,
        secondaryColor: body.secondaryColor,
        logo: body.logo,
        createdById: body.createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: body.createdById,
        action: 'created',
        resource: 'brand',
        resourceId: brand.id,
        details: { brandName: brand.name },
      },
    })

    return apiResponse({ brand }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
