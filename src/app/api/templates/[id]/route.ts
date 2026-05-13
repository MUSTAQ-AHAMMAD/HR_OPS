import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, handleApiError, validateRequestBody } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/templates/[id]
 * Get a single template by ID with version history
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            primaryColor: true,
            secondaryColor: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!template) {
      return apiError('Template not found', 404)
    }

    return apiResponse({ template })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/templates/[id]
 * Update a template (creates new version if content changed)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const body = await validateRequestBody<{
      name?: string
      description?: string
      content?: string
      category?: string
      tags?: string[]
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
      brandId?: string
    }>(request)

    if (!body) {
      return apiError('Invalid request body', 400)
    }

    // If content is being changed, create a new version
    if (body.content) {
      const currentTemplate = await prisma.template.findUnique({
        where: { id },
        include: {
          versions: {
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
      })

      if (!currentTemplate) {
        return apiError('Template not found', 404)
      }

      // Create new version
      const nextVersion = (currentTemplate.versions[0]?.version || 0) + 1
      await prisma.templateVersion.create({
        data: {
          templateId: id,
          version: nextVersion,
          content: body.content,
          createdById: currentTemplate.createdById,
        },
      })
    }

    // Update template
    const template = await prisma.template.update({
      where: { id },
      data: body,
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return apiResponse({ template })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete a template (soft delete by archiving)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.template.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    })

    return apiResponse({ message: 'Template archived successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
