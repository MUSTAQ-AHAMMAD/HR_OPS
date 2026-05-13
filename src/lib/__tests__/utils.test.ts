import { describe, it, expect } from 'vitest'
import {
  cn,
  formatDate,
  formatFileSize,
  truncate,
  generateId,
  meetsContrastRequirements,
} from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
      expect(cn('foo', { bar: true, baz: false })).toBe('foo bar')
    })

    it('should handle Tailwind conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('January')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toContain('January')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
    })

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 5)).toBe('Hi')
    })

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should include prefix if provided', () => {
      const id = generateId('user')
      expect(id).toContain('user_')
    })
  })

  describe('meetsContrastRequirements', () => {
    it('should pass for high contrast colors', () => {
      expect(meetsContrastRequirements('#000000', '#FFFFFF', 'AA')).toBe(true)
      expect(meetsContrastRequirements('#FFFFFF', '#000000', 'AAA')).toBe(true)
    })

    it('should fail for low contrast colors', () => {
      expect(meetsContrastRequirements('#FFFFFF', '#EEEEEE', 'AA')).toBe(false)
    })

    it('should handle different WCAG levels', () => {
      // Black on white has a ratio of 21:1, which passes both AA and AAA
      expect(meetsContrastRequirements('#000000', '#FFFFFF', 'AA')).toBe(true)
      expect(meetsContrastRequirements('#000000', '#FFFFFF', 'AAA')).toBe(true)
    })
  })
})
