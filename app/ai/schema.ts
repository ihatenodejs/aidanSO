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

export const subscriptionPeriods = ['monthly', 'quarterly', 'yearly'] as const

const baseFields = {
  name: string({ minLength: 1, trim: true }),
  icon: optional(anyValue<React.ElementType>()),
  description: string({ minLength: 1, trim: true }),
  link: optional(string({ minLength: 1, trim: true })),
  usage: optional(string({ minLength: 1, trim: true })),
  hasUsage: optional(boolean()),
  price: optional(number({ min: 0 })),
  discountedPrice: optional(number({ min: 0 })),
  subscriptionPeriod: optional(enums(subscriptionPeriods))
} as const

export const activeAiToolSchema = object({
  ...baseFields,
  status: enums(activeToolStatuses)
})

export const inactiveAiToolSchema = object({
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
export type SubscriptionPeriod = (typeof subscriptionPeriods)[number]

export type ActiveAITool = Infer<typeof activeAiToolSchema>
export type InactiveAITool = Infer<typeof inactiveAiToolSchema>

/**
 * Represents an AI tool with its configuration and status.
 * @category AI Configuration
 * @public
 */
export type AITool = Infer<typeof aiToolSchema>

const activeStatusSet = new Set<ActiveToolStatus>(activeToolStatuses)
const inactiveStatusSet = new Set<InactiveToolStatus>(inactiveToolStatuses)

/**
 * Type guard to check if AI tool status is active.
 *
 * @remarks
 * Determines if a given AI tool status indicates the tool is currently
 * active and available for use. Used for conditional rendering and
 * filtering of AI tools in the UI.
 *
 * @param status - The AI tool status to check
 * @returns True if status is an active status
 *
 * @example
 * ```ts
 * if (isActiveStatus(tool.status)) {
 *   console.log('Tool is active')
 * }
 * ```
 *
 * @category AI Schema
 * @public
 */
export function isActiveStatus(
  status: AIToolStatus
): status is ActiveToolStatus {
  return activeStatusSet.has(status as ActiveToolStatus)
}

/**
 * Type guard to check if AI tool status is inactive.
 *
 * @remarks
 * Determines if a given AI tool status indicates the tool is currently
 * inactive or unavailable. Used for conditional rendering and filtering
 * of AI tools in the UI.
 *
 * @param status - The AI tool status to check
 * @returns True if status is an inactive status
 *
 * @example
 * ```ts
 * if (isInactiveStatus(tool.status)) {
 *   console.log('Tool is inactive')
 * }
 * ```
 *
 * @category AI Schema
 * @public
 */
export function isInactiveStatus(
  status: AIToolStatus
): status is InactiveToolStatus {
  return inactiveStatusSet.has(status as InactiveToolStatus)
}

/**
 * Type guard to check if AI tool is inactive.
 *
 * @remarks
 * Determines if an AI tool object has an inactive status. Combines
 * status checking with type narrowing for type-safe operations.
 *
 * @param tool - The AI tool to check
 * @returns True if tool has inactive status
 *
 * @example
 * ```ts
 * if (isInactiveTool(tool)) {
 *   console.log('Tool is inactive:', tool.status)
 * }
 * ```
 *
 * @category AI Schema
 * @public
 */
export function isInactiveTool(tool: AITool): tool is InactiveAITool {
  return isInactiveStatus(tool.status)
}
