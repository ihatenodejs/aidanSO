import type * as React from 'react'
import {
  anyValue,
  array,
  boolean,
  enums,
  number,
  object,
  optional,
  refine,
  string,
  union,
  type Infer,
  type ValidationIssue
} from '@/lib/validation'

export const activeToolStatuses = ['primary', 'active', 'occasional'] as const
export const inactiveToolStatuses = ['cancelled', 'unused'] as const
export const aiToolStatuses = [
  ...activeToolStatuses,
  ...inactiveToolStatuses
] as const

const baseFields = {
  name: string({ minLength: 1, trim: true }),
  icon: optional(anyValue<React.ElementType>()),
  description: string({ minLength: 1, trim: true }),
  link: optional(string({ minLength: 1, trim: true })),
  usage: optional(string({ minLength: 1, trim: true })),
  hasUsage: optional(boolean()),
  price: optional(number({ min: 0 })),
  discountedPrice: optional(number({ min: 0 }))
} as const

const activeAiToolSchema = object({
  ...baseFields,
  status: enums(activeToolStatuses)
})

const inactiveAiToolSchema = object({
  ...baseFields,
  status: enums(inactiveToolStatuses),
  reason: string({ minLength: 1, trim: true })
})

const aiToolSchemaBase = union([activeAiToolSchema, inactiveAiToolSchema])

export const aiToolSchema = refine(aiToolSchemaBase, (tool) => {
  const issues: ValidationIssue[] = []

  if (tool.discountedPrice !== undefined) {
    if (tool.price === undefined) {
      issues.push({
        path: 'price',
        message: 'discountedPrice requires price to be provided'
      })
    } else if (tool.discountedPrice > tool.price) {
      issues.push({
        path: 'discountedPrice',
        message: 'discountedPrice must be less than or equal to price'
      })
    }
  }

  return issues.length > 0 ? issues : undefined
})

export const aiToolListSchema = array(aiToolSchema)

export type ActiveToolStatus = (typeof activeToolStatuses)[number]
export type InactiveToolStatus = (typeof inactiveToolStatuses)[number]
export type AIToolStatus = ActiveToolStatus | InactiveToolStatus

export type ActiveAITool = Infer<typeof activeAiToolSchema>
export type InactiveAITool = Infer<typeof inactiveAiToolSchema>
export type AITool = Infer<typeof aiToolSchema>

const activeStatusSet = new Set<ActiveToolStatus>(activeToolStatuses)
const inactiveStatusSet = new Set<InactiveToolStatus>(inactiveToolStatuses)

export function isActiveStatus(
  status: AIToolStatus
): status is ActiveToolStatus {
  return activeStatusSet.has(status as ActiveToolStatus)
}

export function isInactiveStatus(
  status: AIToolStatus
): status is InactiveToolStatus {
  return inactiveStatusSet.has(status as InactiveToolStatus)
}

export function isInactiveTool(tool: AITool): tool is InactiveAITool {
  return isInactiveStatus(tool.status)
}
