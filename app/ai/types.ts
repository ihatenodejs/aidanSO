export {
  type AITool,
  type AIToolStatus,
  type ActiveAITool,
  type ActiveToolStatus,
  type InactiveAITool,
  type InactiveToolStatus,
  activeToolStatuses,
  aiToolListSchema,
  aiToolSchema,
  aiToolStatuses,
  inactiveToolStatuses,
  isActiveStatus,
  isInactiveStatus,
  isInactiveTool
} from './schema'

/**
 * Represents a favorite AI model with its rating and review.
 * @category AI Configuration
 * @public
 */
export interface FavoriteModel {
  name: string
  provider: string
  review: string
  rating: number // 1.0 - 10.0 scale
}

/**
 * Represents a detailed review of an AI tool with pros, cons, and verdict.
 * @category AI Configuration
 * @public
 */
export interface AIReview {
  tool: string
  rating: number // 1.0 - 10.0 scale
  pros: string[]
  cons: string[]
  verdict: string
}
