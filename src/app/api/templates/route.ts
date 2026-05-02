import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { templateSchema } from '@/lib/validations'
import { apiResponse, apiError, handleApiError, validateRequestBody, getQueryParams } from '@/lib/api-utils'

/**
 * GET /api/templates
 * Get all templates with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const page = parseInt(params.page ?? '1')
    const limit = parseInt(params.limit ?? '10')
    const skip = (page - 1) * limit
    const status = params.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | undefined
    const category = params.category
    const brandId = params.brandId

    const where: {
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
      category?: string
      brandId?: string
    } = {}
    if (status) where.status = status
    if (category) where.category = category
    if (brandId) where.brandId = brandId

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              primaryColor: true,
            },
          },
          _count: {
            select: {
              versions: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.template.count({ where }),
    ])

    return apiResponse({
      templates,
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
 * POST /api/templates
 * Create a new template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      name: string
      description?: string
      content: string
      brandId?: string
      category?: string
      tags?: string[]
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
      createdById: string
    }>(request)

    if (!body) {
      return apiError('Invalid request body', 400)
    }

    // Validate template data
    const validation = templateSchema.safeParse(body)
    if (!validation.success) {
      return apiError('Validation failed', 400, validation.error.errors)
    }

    // Create template
    const template = await prisma.template.create({
      data: {
        name: body.name,
        description: body.description,
        content: body.content,
        brandId: body.brandId,
        category: body.category,
        tags: body.tags ?? [],
        status: body.status ?? 'DRAFT',
        createdById: body.createdById,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        brand: true,
      },
    })

    // Create initial version
    await prisma.templateVersion.create({
      data: {
        templateId: template.id,
        version: 1,
        content: body.content,
        changelog: 'Initial version',
        createdById: body.createdById,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: body.createdById,
        action: 'created',
        resource: 'template',
        resourceId: template.id,
        details: { templateName: template.name },
      },
    })

    return apiResponse({ template }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
