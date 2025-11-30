import { describe, expect, it } from 'bun:test'
import { string, ValidationError } from '../index'

describe('string schema', () => {
  describe('maxLength option', () => {
    it('should pass when string is within maxLength', () => {
      const schema = string({ maxLength: 10 })
      const result = schema.safeParse('hello')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe('hello')
      }
    })

    it('should pass when string equals maxLength exactly', () => {
      const schema = string({ maxLength: 5 })
      const result = schema.safeParse('hello')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe('hello')
      }
    })

    it('should handle empty string with maxLength', () => {
      const schema = string({ maxLength: 10 })
      const result = schema.safeParse('')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe('')
      }
    })

    it('should fail when string exceeds maxLength', () => {
      const schema = string({ maxLength: 5 })
      const result = schema.safeParse('hello world')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.issues).toHaveLength(1)
        expect(result.issues[0].path).toBe('(root)')
        expect(result.issues[0].message).toBe('Expected string length ≤ 5')
      }
    })

    it('should work with trim option', () => {
      const schema = string({ maxLength: 5, trim: true })

      const validResult = schema.safeParse('  hi   ')
      expect(validResult.success).toBe(true)

      const invalidResult = schema.safeParse('  hello world  ')
      expect(invalidResult.success).toBe(false)
    })

    it('should work with both minLength and maxLength', () => {
      const schema = string({ minLength: 3, maxLength: 10 })

      const validResult = schema.safeParse('hello')
      expect(validResult.success).toBe(true)

      const tooShortResult = schema.safeParse('hi')
      expect(tooShortResult.success).toBe(false)

      const tooLongResult = schema.safeParse('hello world')
      expect(tooLongResult.success).toBe(false)
    })

    it('should throw ValidationError when using parse()', () => {
      const schema = string({ maxLength: 5 })

      expect(() => schema.parse('hello world')).toThrow(ValidationError)

      try {
        schema.parse('hello world')
      } catch (error) {
        if (error instanceof ValidationError) {
          expect(error.issues[0].message).toBe('Expected string length ≤ 5')
          expect(error.message).toContain('Validation failed')
        }
      }
    })
  })
})
