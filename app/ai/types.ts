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

export interface FavoriteModel {
  name: string
  provider: string
  review: string
  rating: number // 1.0 - 10.0 scale
}

export interface AIReview {
  tool: string
  rating: number // 1.0 - 10.0 scale
  pros: string[]
  cons: string[]
  verdict: string
}
