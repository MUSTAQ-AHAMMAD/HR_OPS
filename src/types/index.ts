/**
 * TypeScript utility types for the application
 */

import { Prisma } from '@prisma/client'

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Extract non-nullable keys
 */
export type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K
}[keyof T]

/**
 * Make all properties nullable
 */
export type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  timestamp: string
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: string
  details?: unknown
  timestamp: string
}

/**
 * Sort order type
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Filter operator type
 */
export type FilterOperator =
  | 'equals'
  | 'not'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'

/**
 * Generic filter type
 */
export interface Filter<T> {
  field: keyof T
  operator: FilterOperator
  value: unknown
}

/**
 * Query parameters type
 */
export interface QueryParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder
  search?: string
  filters?: Record<string, unknown>
}

/**
 * Prisma model types with relations
 */
export type BrandWithRelations = Prisma.BrandGetPayload<{
  include: {
    createdBy: true
    assets: true
    templates: true
  }
}>

export type TemplateWithRelations = Prisma.TemplateGetPayload<{
  include: {
    brand: true
    createdBy: true
  }
}>

export type EmployeeWithMetadata = Prisma.EmployeeGetPayload<{}>

export type ActivityLogWithUser = Prisma.ActivityLogGetPayload<{
  include: {
    user: true
  }
}>

/**
 * Create input types (omitting auto-generated fields)
 */
export type CreateBrandInput = Omit<
  Prisma.BrandCreateInput,
  'id' | 'createdAt' | 'updatedAt' | 'assets' | 'templates'
>

export type CreateTemplateInput = Omit<
  Prisma.TemplateCreateInput,
  'id' | 'createdAt' | 'updatedAt' | 'version'
>

export type CreateEmployeeInput = Omit<Prisma.EmployeeCreateInput, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Update input types (all fields optional except id)
 */
export type UpdateBrandInput = Partial<CreateBrandInput>
export type UpdateTemplateInput = Partial<CreateTemplateInput>
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>

/**
 * Select fields type helper
 */
export type SelectFields<T> = {
  [K in keyof T]?: boolean
}

/**
 * Dashboard statistics type
 */
export interface DashboardStats {
  overview: {
    brands: {
      total: number
      active: number
      inactive: number
      newThisMonth: number
    }
    templates: {
      total: number
      published: number
      draft: number
      archived: number
      newThisMonth: number
    }
    employees: {
      total: number
      active: number
      inactive: number
      newThisMonth: number
    }
  }
  recentActivity: {
    id: string
    action: string
    resource: string
    resourceId: string
    user: string
    userEmail: string
    createdAt: Date
  }[]
  topDepartments: {
    department: string
    employeeCount: number
  }[]
}

/**
 * Export format type
 */
export type ExportFormat = 'csv' | 'xlsx' | 'json'

/**
 * Bulk operation type
 */
export interface BulkOperation {
  operation: 'activate' | 'deactivate' | 'delete' | 'publish' | 'archive' | 'draft'
  ids: string[]
}

/**
 * Activity log action types
 */
export type ActivityAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'SYNC'

/**
 * Resource types
 */
export type ResourceType = 'brand' | 'template' | 'employee' | 'user' | 'analytics'
