import { describe, it, expect } from 'vitest'
import {
  emailSchema,
  passwordSchema,
  userSchema,
  brandSchema,
  templateSchema,
  employeeSchema,
  sanitizeInput,
  sanitizeHtml,
} from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate valid email addresses', () => {
      expect(emailSchema.parse('test@example.com')).toBe('test@example.com')
      expect(emailSchema.parse('user.name+tag@example.co.uk')).toBe('user.name+tag@example.co.uk')
    })

    it('should reject invalid email addresses', () => {
      expect(() => emailSchema.parse('invalid')).toThrow()
      expect(() => emailSchema.parse('invalid@')).toThrow()
      expect(() => emailSchema.parse('@example.com')).toThrow()
    })
  })

  describe('passwordSchema', () => {
    it('should validate strong passwords', () => {
      const validPassword = 'Test@123'
      expect(passwordSchema.parse(validPassword)).toBe(validPassword)
    })

    it('should reject weak passwords', () => {
      expect(() => passwordSchema.parse('short')).toThrow() // Too short
      expect(() => passwordSchema.parse('nouppercase1!')).toThrow() // No uppercase
      expect(() => passwordSchema.parse('NOLOWERCASE1!')).toThrow() // No lowercase
      expect(() => passwordSchema.parse('NoNumbers!')).toThrow() // No numbers
      expect(() => passwordSchema.parse('NoSpecial123')).toThrow() // No special char
    })
  })

  describe('userSchema', () => {
    it('should validate valid user data', () => {
      const validUser = {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'Test@123',
      }
      expect(userSchema.parse(validUser)).toEqual(validUser)
    })

    it('should reject invalid user data', () => {
      expect(() =>
        userSchema.parse({
          email: 'invalid-email',
          name: 'J',
          password: 'weak',
        })
      ).toThrow()
    })
  })

  describe('brandSchema', () => {
    it('should validate valid brand data', () => {
      const validBrand = {
        name: 'Acme Corp',
        description: 'A great company',
        primaryColor: '#FF5733',
        secondaryColor: '#33FF57',
      }
      const result = brandSchema.parse(validBrand)
      expect(result.name).toBe('Acme Corp')
      expect(result.primaryColor).toBe('#FF5733')
    })

    it('should reject invalid hex colors', () => {
      expect(() =>
        brandSchema.parse({
          name: 'Acme',
          primaryColor: 'not-a-color',
        })
      ).toThrow()
    })
  })

  describe('templateSchema', () => {
    it('should validate valid template data', () => {
      const validTemplate = {
        name: 'Welcome Email',
        content: 'Hello {{name}}',
        status: 'DRAFT' as const,
      }
      expect(templateSchema.parse(validTemplate)).toMatchObject(validTemplate)
    })

    it('should reject empty content', () => {
      expect(() =>
        templateSchema.parse({
          name: 'Empty Template',
          content: '',
        })
      ).toThrow()
    })
  })

  describe('employeeSchema', () => {
    it('should validate valid employee data', () => {
      const validEmployee = {
        email: 'employee@example.com',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Developer',
        department: 'Engineering',
      }
      expect(employeeSchema.parse(validEmployee)).toMatchObject(validEmployee)
    })

    it('should reject missing required fields', () => {
      expect(() =>
        employeeSchema.parse({
          email: 'test@example.com',
          firstName: '',
          lastName: 'Doe',
        })
      ).toThrow()
    })
  })
})

describe('Sanitization Functions', () => {
  describe('sanitizeInput', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      )
      expect(sanitizeInput("It's a test")).toBe('It&#x27;s a test')
    })

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('')
    })
  })

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<script>')
      expect(result).toContain('<p>Hello</p>')
    })

    it('should remove event handlers', () => {
      const input = '<div onclick="alert()">Click</div>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('onclick')
    })

    it('should preserve safe HTML', () => {
      const input = '<p>Hello <strong>world</strong></p>'
      const result = sanitizeHtml(input)
      expect(result).toBe(input)
    })
  })
})
