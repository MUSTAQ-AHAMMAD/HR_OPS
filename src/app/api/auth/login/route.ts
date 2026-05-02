import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, handleApiError, validateRequestBody } from '@/lib/api-utils'

/**
 * POST /api/auth/login
 * Authenticate user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      email: string
      password: string
    }>(request)

    if (!body) {
      return apiError('Invalid request body', 400)
    }

    const { email, password } = body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return apiError('Invalid credentials', 401)
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return apiError('Invalid credentials', 401)
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'logged_in',
        resource: 'user',
        resourceId: user.id,
      },
    })

    // In production, generate JWT token here
    return apiResponse({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
