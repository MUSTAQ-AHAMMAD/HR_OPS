/**
 * Simple in-memory cache with TTL support
 * For production, consider using Redis or similar
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

class Cache {
  private store: Map<string, CacheEntry<unknown>>
  private cleanupInterval: NodeJS.Timeout | null

  constructor(cleanupIntervalMs: number = 60000) {
    this.store = new Map()
    this.cleanupInterval = null

    // Start periodic cleanup
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup()
      }, cleanupIntervalMs)
    }
  }

  /**
   * Set a value in cache with TTL (time to live) in seconds
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000

    this.store.set(key, {
      value,
      expiresAt,
    })
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.store.get(key)

    if (!entry) {
      return false
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return false
    }

    return true
  }

  /**
   * Delete a specific key
   */
  delete(key: string): void {
    this.store.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now()

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Get or set pattern - fetch from cache or execute function and cache result
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = this.get<T>(key)

    if (cached !== null) {
      return cached
    }

    const value = await fn()
    this.set(key, value, ttlSeconds)

    return value
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern)

    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    keys: string[]
  } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    }
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Global cache instance
export const cache = new Cache()

/**
 * Cache key generators for different resources
 */
export const cacheKeys = {
  brand: (id: string) => `brand:${id}`,
  brands: (page: number, limit: number) => `brands:${page}:${limit}`,
  template: (id: string) => `template:${id}`,
  templates: (page: number, limit: number, brandId?: string) =>
    `templates:${page}:${limit}:${brandId || 'all'}`,
  employee: (id: string) => `employee:${id}`,
  employees: (page: number, limit: number, department?: string) =>
    `employees:${page}:${limit}:${department || 'all'}`,
  dashboardStats: () => 'dashboard:stats',
  analytics: (startDate?: string, endDate?: string) =>
    `analytics:${startDate || 'all'}:${endDate || 'all'}`,
}

/**
 * Cache invalidation helpers
 */
export const invalidateCache = {
  brand: (id?: string) => {
    if (id) {
      cache.delete(cacheKeys.brand(id))
    }
    cache.invalidatePattern('^brands:')
    cache.delete(cacheKeys.dashboardStats())
  },
  template: (id?: string) => {
    if (id) {
      cache.delete(cacheKeys.template(id))
    }
    cache.invalidatePattern('^templates:')
    cache.delete(cacheKeys.dashboardStats())
  },
  employee: (id?: string) => {
    if (id) {
      cache.delete(cacheKeys.employee(id))
    }
    cache.invalidatePattern('^employees:')
    cache.delete(cacheKeys.dashboardStats())
  },
  all: () => {
    cache.clear()
  },
}
