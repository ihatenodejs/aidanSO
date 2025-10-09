/**
 * Type definitions for AI usage analytics and token tracking.
 *
 * @remarks
 * This module contains interfaces for Claude AI usage data, including:
 * - Token consumption metrics (input, output, cache)
 * - Cost calculations
 * - Daily aggregations
 * - Trend analysis
 * - Model-specific breakdowns
 *
 * @module lib/types/ai
 * @category Types
 */

/**
 * Breakdown of AI usage metrics for a specific model.
 *
 * @remarks
 * Contains token counts and cost for a single AI model within a time period.
 * Used to track usage across different models (e.g., Claude Sonnet, Opus).
 *
 * @example
 * ```ts
 * const breakdown: ModelBreakdown = {
 *   modelName: 'claude-sonnet-4-20250514',
 *   inputTokens: 150000,
 *   outputTokens: 75000,
 *   cacheCreationTokens: 5000,
 *   cacheReadTokens: 50000,
 *   cost: 2.45
 * }
 * ```
 *
 * @public
 */
export interface ModelBreakdown {
  /** Model identifier (e.g., 'claude-sonnet-4-20250514') */
  modelName: string
  /** Number of input tokens consumed */
  inputTokens: number
  /** Number of output tokens generated */
  outputTokens: number
  /** Number of tokens written to cache */
  cacheCreationTokens: number
  /** Number of tokens read from cache */
  cacheReadTokens: number
  /** Total cost in USD for this model's usage */
  cost: number
}

/**
 * Aggregated AI usage data for a single day.
 *
 * @remarks
 * Represents all AI interactions for a 24-hour period, including:
 * - Total token counts across all models
 * - Total cost in USD
 * - Per-model breakdowns
 * - List of models used
 *
 * Date format is ISO 8601 (YYYY-MM-DD).
 *
 * @example
 * ```ts
 * const dailyData: DailyData = {
 *   date: '2025-01-15',
 *   inputTokens: 500000,
 *   outputTokens: 250000,
 *   cacheCreationTokens: 10000,
 *   cacheReadTokens: 100000,
 *   totalTokens: 860000,
 *   totalCost: 8.50,
 *   modelsUsed: ['claude-sonnet-4-20250514'],
 *   modelBreakdowns: [...]
 * }
 * ```
 *
 * @public
 */
export interface DailyData {
  /** Date in ISO 8601 format (YYYY-MM-DD) */
  date: string
  /** Total input tokens for the day */
  inputTokens: number
  /** Total output tokens for the day */
  outputTokens: number
  /** Total cache creation tokens for the day */
  cacheCreationTokens: number
  /** Total cache read tokens for the day */
  cacheReadTokens: number
  /** Sum of all token types */
  totalTokens: number
  /** Total cost in USD for the day */
  totalCost: number
  /** List of model identifiers used this day */
  modelsUsed: string[]
  /** Per-model usage breakdowns */
  modelBreakdowns: ModelBreakdown[]
}

/**
 * Aggregated totals across all time periods.
 *
 * @remarks
 * Represents cumulative usage metrics, typically used for:
 * - All-time totals
 * - Custom date range totals
 * - Filtered subset totals
 *
 * @example
 * ```ts
 * const totals: Totals = {
 *   inputTokens: 15000000,
 *   outputTokens: 7500000,
 *   cacheCreationTokens: 100000,
 *   cacheReadTokens: 1000000,
 *   totalCost: 250.00,
 *   totalTokens: 23600000
 * }
 * ```
 *
 * @public
 */
export interface Totals {
  /** Cumulative input tokens */
  inputTokens: number
  /** Cumulative output tokens */
  outputTokens: number
  /** Cumulative cache creation tokens */
  cacheCreationTokens: number
  /** Cumulative cache read tokens */
  cacheReadTokens: number
  /** Cumulative cost in USD */
  totalCost: number
  /** Sum of all cumulative tokens */
  totalTokens: number
}

/**
 * Complete AI usage dataset with daily breakdowns and totals.
 *
 * @remarks
 * Primary data structure for AI analytics, containing:
 * - Daily usage history
 * - Aggregate totals
 *
 * Typically loaded from JSON data files or API responses.
 *
 * @example
 * ```ts
 * const data: CCData = {
 *   daily: [...], // Array of DailyData
 *   totals: {
 *     inputTokens: 15000000,
 *     outputTokens: 7500000,
 *     // ... other totals
 *   }
 * }
 * ```
 *
 * @public
 */
export interface CCData {
  /** Array of daily usage data, typically sorted chronologically */
  daily: DailyData[]
  /** Aggregated totals across all daily data */
  totals: Totals
}

/**
 * Extended AI usage data supporting multiple sources (Claude Code, Codex, etc.).
 *
 * @remarks
 * Used for dashboards that display multiple AI tool usages side-by-side.
 * Each tool can have its own daily history and totals.
 *
 * @example
 * ```ts
 * const extended: ExtendedCCData = {
 *   totals: { ... }, // Combined totals
 *   claudeCode: {
 *     daily: [...],
 *     totals: { ... }
 *   },
 *   codex: {
 *     daily: [...],
 *     totals: { ... }
 *   }
 * }
 * ```
 *
 * @public
 */
export interface ExtendedCCData {
  /** Combined totals across all sources (optional) */
  totals?: Totals
  /** Claude Code usage data */
  claudeCode?: {
    daily: DailyData[]
    totals: Totals
  }
  /** Codex usage data */
  codex?: {
    daily: DailyData[]
    totals: Totals
  }
}

/**
 * Time range selector keys for filtering AI usage data.
 *
 * @remarks
 * Used in dropdown menus and filters to select predefined time ranges:
 * - '7d': Last 7 days
 * - '1m': Last 1 month
 * - '3m': Last 3 months
 * - '6m': Last 6 months
 * - '1y': Last 1 year
 * - 'all': All available data
 *
 * @example
 * ```ts
 * function filterByRange(data: DailyData[], range: TimeRangeKey) {
 *   // Implementation
 * }
 * ```
 *
 * @public
 */
export type TimeRangeKey = '7d' | '1m' | '3m' | '6m' | '1y' | 'all'

/**
 * Single day cell data for heatmap visualization.
 *
 * @remarks
 * Contains all data needed to render one cell in a GitHub-style contribution heatmap:
 * - Date information
 * - Usage metrics (tokens, cost)
 * - Display formatting
 *
 * @example
 * ```ts
 * const heatmapDay: HeatmapDay = {
 *   date: '2025-01-15',
 *   value: 8.50,
 *   tokens: 860000,
 *   cost: 8.50,
 *   day: 1, // Monday
 *   formattedDate: 'Jan 15, 2025'
 * }
 * ```
 *
 * @public
 */
export interface HeatmapDay {
  /** Date in ISO 8601 format (YYYY-MM-DD) */
  date: string
  /** Primary value for heatmap intensity (typically cost) */
  value: number
  /** Total tokens for tooltip display */
  tokens: number
  /** Total cost for tooltip display */
  cost: number
  /** Day of week (0 = Sunday, 6 = Saturday) */
  day: number
  /** Human-readable date string for tooltips */
  formattedDate: string
}

/**
 * Daily data extended with trend analysis for chart visualizations.
 *
 * @remarks
 * Extends {@link DailyData} with:
 * - Linear regression trend lines
 * - Normalized token values for charting
 *
 * Used for displaying trend overlays on usage charts.
 *
 * @example
 * ```ts
 * const trendData: DailyDataWithTrend = {
 *   ...dailyData,
 *   costTrend: 8.75, // Predicted cost from regression
 *   tokensTrend: 0.9, // Predicted tokens in millions
 *   inputTokensNormalized: 500, // Input tokens / 1000
 *   outputTokensNormalized: 250, // Output tokens / 1000
 *   cacheTokensNormalized: 0.11 // Cache tokens / 1000000
 * }
 * ```
 *
 * @public
 */
export interface DailyDataWithTrend extends DailyData {
  /** Predicted cost from linear regression (null if not enough data) */
  costTrend: number | null
  /** Predicted tokens in millions from linear regression (null if not enough data) */
  tokensTrend: number | null
  /** Input tokens divided by 1000 for chart display */
  inputTokensNormalized: number
  /** Output tokens divided by 1000 for chart display */
  outputTokensNormalized: number
  /** Cache tokens divided by 1000000 for chart display */
  cacheTokensNormalized: number
}

/**
 * Model usage statistics for pie/bar charts.
 *
 * @remarks
 * Represents usage distribution across different AI models.
 * Includes both absolute values and percentages for visualization.
 *
 * @example
 * ```ts
 * const usage: ModelUsage = {
 *   name: 'Claude Sonnet 4',
 *   value: 125.50,
 *   percentage: 65.2
 * }
 * ```
 *
 * @public
 */
export interface ModelUsage {
  /** Human-readable model name */
  name: string
  /** Total cost or usage value */
  value: number
  /** Percentage of total usage (optional) */
  percentage?: number
  /** Allow additional properties for chart libraries */
  [key: string]: string | number | undefined
}

/**
 * Token type usage statistics for composition charts.
 *
 * @remarks
 * Breaks down usage by token type (input, output, cache creation, cache read).
 * Used for pie charts showing token distribution.
 *
 * @example
 * ```ts
 * const tokenUsage: TokenTypeUsage = {
 *   name: 'Input',
 *   value: 15000000,
 *   percentage: 63.5
 * }
 * ```
 *
 * @public
 */
export interface TokenTypeUsage {
  /** Token type name ('Input', 'Output', 'Cache Creation', 'Cache Read') */
  name: string
  /** Total token count */
  value: number
  /** Percentage of total tokens (optional) */
  percentage?: number
}
