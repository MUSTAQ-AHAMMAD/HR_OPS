import { z } from 'zod'

/**
 * Environment variable schema
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),

  // Optional: OpenAI
  OPENAI_API_KEY: z.string().optional(),

  // Optional: Azure AD
  AZURE_AD_CLIENT_ID: z.string().optional(),
  AZURE_AD_CLIENT_SECRET: z.string().optional(),
  AZURE_AD_TENANT_ID: z.string().optional(),

  // Optional: Rate Limiting
  RATE_LIMIT_MAX: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 100)),
  RATE_LIMIT_WINDOW_MS: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 900000)),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validate environment variables
 * @throws {Error} if validation fails
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`)
      throw new Error(
        `Environment validation failed:\n${missingVars.join('\n')}\n\nPlease check your .env file.`
      )
    }
    throw error
  }
}

/**
 * Get validated environment variables
 */
export function getEnv(): Env {
  return validateEnv()
}

/**
 * Check if optional services are configured
 */
export function getServiceStatus() {
  const env = process.env

  return {
    openai: !!env.OPENAI_API_KEY,
    azure: !!(env.AZURE_AD_CLIENT_ID && env.AZURE_AD_TENANT_ID),
    database: !!env.DATABASE_URL,
    auth: !!(env.NEXTAUTH_SECRET && env.NEXTAUTH_URL),
  }
}
