import { describe, expect, it } from 'bun:test'
import {
  aiToolListSchema,
  aiToolSchema,
  isInactiveTool,
  type AIToolStatus
} from '../../schema'

const baseTool = {
  name: 'Test Tool',
  description: 'An example tool',
  status: 'primary' as AIToolStatus
}

describe('aiToolSchema', () => {
  it('accepts a valid active tool without reason', () => {
    const result = aiToolSchema.safeParse(baseTool)
    expect(result.success).toBe(true)
    if (result.success) {
      expect('reason' in result.value).toBe(false)
    }
  })

  it('rejects an inactive tool without reason', () => {
    const result = aiToolSchema.safeParse({
      ...baseTool,
      status: 'cancelled'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.some((issue) => issue.path === 'reason')).toBe(true)
    }
  })

  it('rejects discountedPrice without price', () => {
    const result = aiToolSchema.safeParse({
      ...baseTool,
      discountedPrice: 5
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues).toContainEqual({
        path: 'price',
        message: 'discountedPrice requires price to be provided'
      })
    }
  })

  it('rejects discountedPrice higher than price', () => {
    const result = aiToolSchema.safeParse({
      ...baseTool,
      price: 5,
      discountedPrice: 10
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues).toContainEqual({
        path: 'discountedPrice',
        message: 'discountedPrice must be less than or equal to price'
      })
    }
  })

  it('accepts inactive tool with reason', () => {
    const result = aiToolSchema.safeParse({
      ...baseTool,
      status: 'unused',
      reason: 'Replaced by another option'
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(isInactiveTool(result.value)).toBe(true)
      if (isInactiveTool(result.value)) {
        expect(result.value.reason).toBe('Replaced by another option')
      }
    }
  })
})

describe('aiToolListSchema', () => {
  it('parses an array and allows filtering inactive tools', () => {
    const result = aiToolListSchema.safeParse([
      baseTool,
      { ...baseTool, status: 'unused', reason: 'Deprecated' }
    ])

    expect(result.success).toBe(true)
    if (result.success) {
      const inactive = result.value.filter(isInactiveTool)
      expect(inactive).toHaveLength(1)
      expect(inactive[0].status).toBe('unused')
    }
  })
})
