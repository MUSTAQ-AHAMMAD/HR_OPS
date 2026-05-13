/**
 * Pagination utilities for API responses
 */

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResult {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Parse pagination parameters from URL search params
 */
export function getPaginationParams(searchParams: URLSearchParams): {
  skip: number
  take: number
  page: number
  limit: number
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
  const skip = (page - 1) * limit

  return { skip, take: limit, page, limit }
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationResult {
  const totalPages = Math.ceil(total / limit)

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

/**
 * Get sort parameters from search params
 */
export function getSortParams(searchParams: URLSearchParams): {
  sortBy: string
  sortOrder: 'asc' | 'desc'
} {
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

  return { sortBy, sortOrder }
}

/**
 * Build Prisma orderBy clause from sort params
 */
export function buildOrderBy(sortBy: string, sortOrder: 'asc' | 'desc') {
  return { [sortBy]: sortOrder }
}

/**
 * Parse search query and build Prisma where clause
 */
export function buildSearchQuery(
  searchTerm: string | null,
  searchableFields: string[]
): Record<string, unknown> | undefined {
  if (!searchTerm || searchTerm.trim() === '') {
    return undefined
  }

  const trimmedSearch = searchTerm.trim()

  return {
    OR: searchableFields.map((field) => ({
      [field]: {
        contains: trimmedSearch,
        mode: 'insensitive',
      },
    })),
  }
}

/**
 * Build date range filter
 */
export function buildDateRangeFilter(
  startDate?: string | null,
  endDate?: string | null,
  field: string = 'createdAt'
): Record<string, unknown> | undefined {
  if (!startDate && !endDate) {
    return undefined
  }

  const filter: Record<string, unknown> = {}

  if (startDate) {
    filter[field] = { gte: new Date(startDate) }
  }

  if (endDate) {
    if (filter[field]) {
      (filter[field] as Record<string, unknown>).lte = new Date(endDate)
    } else {
      filter[field] = { lte: new Date(endDate) }
    }
  }

  return filter
}

/**
 * Combine multiple where clauses with AND
 */
export function combineWhereConditions(
  ...conditions: (Record<string, unknown> | undefined)[]
): Record<string, unknown> | undefined {
  const validConditions = conditions.filter(
    (c): c is Record<string, unknown> => c !== undefined && Object.keys(c).length > 0
  )

  if (validConditions.length === 0) {
    return undefined
  }

  if (validConditions.length === 1) {
    return validConditions[0]
  }

  return {
    AND: validConditions,
  }
}
