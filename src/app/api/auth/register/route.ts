import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { emailSchema, passwordSchema } from '@/lib/validations'
import { apiResponse, apiError, handleApiError, validateRequestBody } from '@/lib/api-utils'

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      email: string
      name: string
      password: string
    }>(request)

    if (!body) {
      return apiError('Invalid request body', 400)
    }

    const { email, name, password } = body

    // Validate email and password
    const emailValidation = emailSchema.safeParse(email)
    if (!emailValidation.success) {
      return apiError('Invalid email address', 400)
    }

    const passwordValidation = passwordSchema.safeParse(password)
    if (!passwordValidation.success) {
      return apiError(passwordValidation.error.errors[0]?.message ?? 'Invalid password', 400)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return apiError('User with this email already exists', 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'registered',
        resource: 'user',
        resourceId: user.id,
      },
    })

    return apiResponse(
      {
        message: 'User registered successfully',
        user,
      },
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}
