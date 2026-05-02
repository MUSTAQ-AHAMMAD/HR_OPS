import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, handleApiError, validateRequestBody } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/brands/[id]
 * Get a single brand by ID
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assets: true,
        templates: {
          where: { status: 'PUBLISHED' },
          take: 5,
          orderBy: { updatedAt: 'desc' },
        },
      },
    })

    if (!brand) {
      return apiError('Brand not found', 404)
    }

    return apiResponse({ brand })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/brands/[id]
 * Update a brand
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const body = await validateRequestBody<{
      name?: string
      description?: string
      primaryColor?: string
      secondaryColor?: string
      logo?: string
      isActive?: boolean
    }>(request)

    if (!body) {
      return apiError('Invalid request body', 400)
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: body,
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

    return apiResponse({ brand })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/brands/[id]
 * Delete a brand (soft delete by setting isActive to false)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.brand.update({
      where: { id },
      data: { isActive: false },
    })

    return apiResponse({ message: 'Brand deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
