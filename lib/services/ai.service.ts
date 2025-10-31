import {
  CCData,
  DailyData,
  HeatmapDay,
  DailyDataWithTrend,
  ModelUsage,
  TokenTypeUsage,
  TimeRangeKey
} from '@/lib/types'

/**
 * Configuration for heatmap color palette.
 *
 * @remarks
 * Defines the color scheme used for GitHub-style activity heatmaps,
 * with support for empty days and multi-step gradient scales.
 *
 * @example
 * ```ts
 * const palette: HeatmapPalette = {
 *   empty: '#1f2937',  // Gray for zero activity
 *   steps: ['#4a3328', '#6b4530', '#8d5738', '#c15f3c']  // Brown gradient
 * }
 * ```
 *
 * @category Services
 * @public
 */
export interface HeatmapPalette {
  /** Color for days with no activity (value = 0) */
  empty: string
  /** Array of colors representing increasing activity levels */
  steps: string[]
}

/**
 * Comprehensive AI usage statistics and analytics.
 *
 * @remarks
 * Provides a complete snapshot of AI usage including streaks, costs,
 * token consumption, time-based averages, and token distribution breakdowns.
 *
 * @example
 * ```ts
 * const stats = AIService.getAIStats(ccData)
 * console.log(`Streak: ${stats.streakFormatted}`)
 * console.log(`Total cost: $${stats.totalCost.toFixed(2)}`)
 * console.log(`Last 7 days: $${stats.last7Days.cost.toFixed(2)}`)
 * ```
 *
 * @category Services
 * @public
 */
export interface AIStatsResult {
  /** Current activity streak in days */
  streak: number
  /** Formatted streak string (e.g., '2y', '3mo', '5d') */
  streakFormatted: string
  /** Total cost across all time */
  totalCost: number
  /** Total tokens consumed across all time */
  totalTokens: number
  /** Average daily cost across all recorded days */
  dailyAverage: number
  /** Statistics for the last 7 days */
  last7Days: {
    cost: number
    tokens: number
    dailyAverage: number
  }
  /** Statistics for the last 30 days */
  last30Days: {
    cost: number
    tokens: number
    dailyAverage: number
  }
  /** Token type breakdown */
  tokenBreakdown: {
    input: number
    output: number
    cache: number
  }
}

/**
 * Service for AI usage analytics, token tracking, and cost calculations.
 *
 * @remarks
 * Provides comprehensive utilities for analyzing Claude API usage including:
 * - **Activity streaks** - Track consecutive days of usage
 * - **Trend analysis** - Linear regression for cost and token projections
 * - **Heatmap generation** - GitHub-style activity visualization
 * - **Time-range filtering** - Support for 7d, 1m, 3m, 6m, 1y, all
 * - **Model analytics** - Usage breakdown by model
 * - **Token composition** - Input, output, and cache token analysis
 * - **Statistics** - Comprehensive metrics and aggregations
 *
 * All date operations use UTC to ensure consistency across timezones.
 *
 * @example
 * ```ts
 * import { AIService } from '@/lib/services'
 *
 * // Get activity streak
 * const streak = AIService.computeStreak(ccData.daily)
 * console.log(`${streak} day streak`)
 *
 * // Filter data by time range
 * const last30Days = AIService.filterDailyByRange(ccData.daily, '1m')
 *
 * // Build trend data with linear regression
 * const trendData = AIService.buildDailyTrendData(ccData.daily)
 *
 * // Generate heatmap for current year
 * const heatmap = AIService.prepareHeatmapData(ccData.daily)
 *
 * // Get comprehensive statistics
 * const stats = AIService.getAIStats(ccData)
 * ```
 *
 * @category Services
 * @public
 */
export class AIService {
  private static readonly MODEL_LABELS: Record<string, string> = {
    // Claude models (Anthropic)
    'claude-sonnet-4-20250514': 'Claude Sonnet 4',
    'claude-sonnet-4-5-20250929': 'Claude Sonnet 4.5',
    'claude-sonnet-4.5': 'Claude Sonnet 4.5',
    'claude-haiku-4-5-20251001': 'Claude Haiku 4.5',
    'claude-haiku-4.5': 'Claude Haiku 4.5',
    'claude-opus-4-1-20250805': 'Claude Opus 4.1',
    // OpenAI models
    'gpt-5': 'GPT-5',
    'gpt-5-codex': 'GPT-5 Codex',
    // Gemini models (Google)
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
    'gemini-2.5-pro-preview-06-05': 'Gemini 2.5 Pro Preview (2025-06-05)',
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'gemma-3-27b': 'Gemma 3 27B',
    // Qwen models (Alibaba)
    'qwen3-235b-a22b': 'Qwen 3 235B',
    'qwen3-max-preview': 'Qwen 3 Max Preview',
    'qwen2.5-coder-32b': 'Qwen 2.5 Coder 32B',
    'qwen/qwen3-coder-30b': 'Qwen Coder 30B',
    'coder-model': 'Qwen Coder',
    // Z.AI models
    'glm-4.5': 'GLM 4.5',
    'glm-4.5-air': 'GLM 4.5 Air',
    // Ghost models
    'big-pickle': 'Big Pickle'
  }

  private static readonly RANGE_CONFIG: Record<
    Exclude<TimeRangeKey, 'all'>,
    { days?: number; months?: number }
  > = {
    '7d': { days: 7 },
    '1m': { months: 1 },
    '3m': { months: 3 },
    '6m': { months: 6 },
    '1y': { months: 12 }
  }

  /**
   * Converts a model ID to a human-readable label.
   *
   * @param modelName - The model identifier (e.g., 'claude-sonnet-4-20250514')
   * @returns {string} Human-readable model name or original modelName if not found
   *
   * @example
   * ```ts
   * const label = AIService.getModelLabel('claude-sonnet-4-20250514')
   * console.log(label) // 'Claude Sonnet 4'
   * ```
   */
  static getModelLabel(modelName: string): string {
    return this.MODEL_LABELS[modelName] || modelName
  }

  /**
   * Computes the current activity streak in days.
   * A streak is broken if there's any day without usage between the latest day and today.
   *
   * @param daily - Array of daily usage data (doesn't need to be sorted)
   * @returns {number} Consecutive days with activity from most recent date
   *
   * @example
   * ```ts
   * const streak = AIService.computeStreak(dailyData)
   * console.log(`Current streak: ${streak} days`)
   * ```
   */
  static computeStreak(daily: DailyData[]): number {
    if (!daily.length) return 0

    const datesSet = new Set(daily.map((d) => d.date))
    const latest = daily
      .map((d) => new Date(d.date + 'T00:00:00Z'))
      .reduce((a, b) => (a > b ? a : b))

    const toKey = (d: Date) => {
      const y = d.getUTCFullYear()
      const m = (d.getUTCMonth() + 1).toString().padStart(2, '0')
      const day = d.getUTCDate().toString().padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    let count = 0
    for (
      let d = new Date(latest.getTime());
      ;
      d = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 1)
      )
    ) {
      const key = toKey(d)
      if (datesSet.has(key)) count++
      else break
    }
    return count
  }

  /**
   * Formats a number of days into a compact string representation.
   *
   * @param days - Number of days to format
   * @returns {`${number}${'y' | 'mo' | 'w' | 'd'}`} Compact string like '2y', '3mo', '5w', or '10d'
   *
   * @example
   * ```ts
   * console.log(AIService.formatStreakCompact(400)) // '1y'
   * console.log(AIService.formatStreakCompact(45))  // '1mo'
   * console.log(AIService.formatStreakCompact(14))  // '2w'
   * console.log(AIService.formatStreakCompact(5))   // '5d'
   * ```
   */
  static formatStreakCompact(days: number): string {
    if (days >= 365) return `${Math.floor(days / 365)}y`
    if (days >= 30) return `${Math.floor(days / 30)}mo`
    if (days >= 7) return `${Math.floor(days / 7)}w`
    return `${days}d`
  }

  /**
   * Normalizes a date to UTC midnight (start of day).
   *
   * @param date - Date to normalize
   * @returns {Date} Date set to UTC midnight
   * @internal
   */
  private static startOfDay(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    )
  }

  /**
   * Converts a Date to YYYY-MM-DD string format in UTC.
   *
   * @param date - Date to convert
   * @returns {string} Date string like '2025-01-15'
   * @internal
   */
  private static toDateKey(date: Date): string {
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`
  }

  /**
   * Subtracts months from a date in UTC, handling month-end edge cases.
   *
   * @param date - Starting date
   * @param months - Number of months to subtract
   * @returns {Date} Date with months subtracted, clamped to valid days
   * @internal
   */
  private static subtractUtcMonths(date: Date, months: number): Date {
    const targetMonthIndex = date.getUTCMonth() - months
    const anchor = new Date(
      Date.UTC(date.getUTCFullYear(), targetMonthIndex, 1)
    )
    const endOfAnchorMonth = new Date(
      Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 0)
    )
    const clampedDay = Math.min(
      date.getUTCDate(),
      endOfAnchorMonth.getUTCDate()
    )
    anchor.setUTCDate(clampedDay)
    return this.startOfDay(anchor)
  }

  /**
   * Creates an empty DailyData object for dates with no activity.
   *
   * @param dateKey - Date string in YYYY-MM-DD format
   * @returns {DailyData} Object with all metrics set to zero
   * @internal
   */
  private static emptyDay(dateKey: string): DailyData {
    return {
      date: dateKey,
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0,
      totalTokens: 0,
      totalCost: 0,
      modelsUsed: [],
      modelBreakdowns: []
    }
  }

  /**
   * Builds a continuous daily series from start to end date, filling gaps with empty days.
   *
   * @param start - Start date (inclusive)
   * @param end - End date (inclusive)
   * @param byDate - Map of date keys to DailyData
   * @returns {DailyData[]} Continuous array with one entry per day
   * @internal
   */
  private static buildFilledRange(
    start: Date,
    end: Date,
    byDate: Map<string, DailyData>
  ): DailyData[] {
    const series: DailyData[] = []
    for (
      let cursor = new Date(start.getTime());
      cursor <= end;
      cursor = new Date(
        Date.UTC(
          cursor.getUTCFullYear(),
          cursor.getUTCMonth(),
          cursor.getUTCDate() + 1
        )
      )
    ) {
      const key = this.toDateKey(cursor)
      series.push(byDate.get(key) ?? this.emptyDay(key))
    }
    return series
  }

  /**
   * Fills gaps in daily data with empty days between the first and last date.
   * Ensures a continuous time series for visualization.
   *
   * @param daily - Array of daily usage data (will be sorted internally)
   * @returns {DailyData[]} Continuous array with empty days filled between first and last date
   *
   * @example
   * ```ts
   * const filled = AIService.computeFilledDailyRange(sparseData)
   * // Now every day from first to last has an entry
   * ```
   */
  static computeFilledDailyRange(daily: DailyData[]): DailyData[] {
    if (!daily.length) return []

    const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date))
    const start = this.startOfDay(new Date(sorted[0].date + 'T00:00:00Z'))
    const end = this.startOfDay(
      new Date(sorted[sorted.length - 1].date + 'T00:00:00Z')
    )
    const byDate = new Map(sorted.map((d) => [d.date, d] as const))

    return this.buildFilledRange(start, end, byDate)
  }

  /**
   * Transforms daily token data into normalized values for charting.
   * Converts token counts to thousands (K) or millions (M) for readability.
   *
   * @param daily - Array of daily usage data
   * @returns {Array<{ date: string; inputTokens: number; outputTokens: number; cacheTokens: number }>}
   *   Array of objects with date and normalized token counts (inputTokens & outputTokens in thousands, cacheTokens in millions)
   *
   * @example
   * ```ts
   * const chartData = AIService.buildTokenCompositionData(dailyData)
   * // [{ date: '2025-01-01', inputTokens: 150.5, outputTokens: 75.2, cacheTokens: 2.3 }]
   * ```
   */
  static buildTokenCompositionData(daily: DailyData[]) {
    return daily.map((day) => ({
      date: day.date,
      inputTokens: day.inputTokens / 1000, // Convert to K
      outputTokens: day.outputTokens / 1000, // Convert to K
      cacheTokens: (day.cacheCreationTokens + day.cacheReadTokens) / 1000000 // Convert to M
    }))
  }

  /**
   * Builds daily data with linear regression trend lines for cost and token usage.
   * Uses least-squares method to compute trend from first non-zero data point.
   *
   * @param daily - Array of daily usage data
   * @returns {DailyDataWithTrend[]} Array of daily data with added trend properties:
   *   - `costTrend: number | null` - Linear regression projected cost
   *   - `tokensTrend: number | null` - Linear regression projected tokens (in millions)
   *   - `inputTokensNormalized: number` - Input tokens / 1000
   *   - `outputTokensNormalized: number` - Output tokens / 1000
   *   - `cacheTokensNormalized: number` - Cache tokens / 1000000
   *
   * @example
   * ```ts
   * const trendData = AIService.buildDailyTrendData(dailyData)
   * // Each day includes costTrend and tokensTrend for visualization
   * ```
   */
  static buildDailyTrendData(daily: DailyData[]): DailyDataWithTrend[] {
    const filled = this.computeFilledDailyRange(daily)
    const rows = filled.map((day) => ({
      ...day,
      costTrend: null as number | null,
      tokensTrend: null as number | null,
      inputTokensNormalized: day.inputTokens / 1000,
      outputTokensNormalized: day.outputTokens / 1000,
      cacheTokensNormalized:
        (day.cacheCreationTokens + day.cacheReadTokens) / 1000000
    }))

    const applyTrend = (
      startIndex: number,
      valueAccessor: (row: (typeof rows)[number]) => number,
      assign: (row: (typeof rows)[number], value: number | null) => void
    ) => {
      if (startIndex === -1 || startIndex >= rows.length) {
        return
      }

      const subset = rows.slice(startIndex)
      if (!subset.length) {
        return
      }

      if (subset.length === 1) {
        const value = Math.max(valueAccessor(subset[0]), 0)
        assign(subset[0], value)
        return
      }

      const n = subset.length
      const sumX = (n * (n - 1)) / 2
      const sumX2 = ((n - 1) * n * (2 * n - 1)) / 6

      let sumY = 0
      let sumXY = 0

      subset.forEach((row, idx) => {
        const y = valueAccessor(row)
        sumY += y
        sumXY += idx * y
      })

      const denom = n * sumX2 - sumX * sumX
      const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0
      const intercept = (sumY - slope * sumX) / n

      subset.forEach((row, idx) => {
        const projected = Math.max(intercept + slope * idx, 0)
        assign(row, projected)
      })
    }

    const firstCostIndex = rows.findIndex((row) => row.totalCost > 0)
    const firstTokenIndex = rows.findIndex((row) => row.totalTokens > 0)

    applyTrend(
      firstCostIndex,
      (row) => row.totalCost,
      (row, value) => {
        row.costTrend = value
      }
    )

    applyTrend(
      firstTokenIndex,
      (row) => row.totalTokens / 1000000,
      (row, value) => {
        row.tokensTrend = value
      }
    )

    return rows
  }

  /**
   * Generates a heatmap grid for the current year.
   *
   * @param daily - Array of daily usage data
   * @returns {(HeatmapDay | null)[][]} 2D array where each inner array is a week (Sunday-Saturday),
   *   null represents days before year start
   *
   * @remarks
   * Creates a calendar-style heatmap visualization:
   * - Covers January 1 through today of current year
   * - Organized by weeks (Sunday-Saturday)
   * - Fills missing days before year start with null
   * - Pads incomplete final week with null
   * - Uses UTC for consistent timezone handling
   *
   * @example
   * ```ts
   * const heatmap = AIService.prepareHeatmapData(ccData.daily)
   * // Returns: [[null, null, {day1}, {day2}, ...], [{day8}, ...]]
   *
   * // Use with getHeatmapColor for visualization
   * heatmap.forEach(week => {
   *   week.forEach(day => {
   *     if (day) {
   *       const color = AIService.getHeatmapColor(maxCost, day.cost)
   *       // Render day cell with color
   *     }
   *   })
   * })
   * ```
   */
  static prepareHeatmapData(daily: DailyData[]): (HeatmapDay | null)[][] {
    const dayMap = new Map<string, DailyData>()
    daily.forEach((day) => {
      dayMap.set(day.date, day)
    })

    const today = new Date()
    const startOfYear = new Date(Date.UTC(today.getUTCFullYear(), 0, 1))
    const endDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    )

    const weeks: (HeatmapDay | null)[][] = []
    let currentWeek: (HeatmapDay | null)[] = []

    const firstDay = startOfYear.getUTCDay()
    const startDate = new Date(startOfYear)
    startDate.setUTCDate(startDate.getUTCDate() - firstDay)

    for (
      let d = new Date(startDate);
      d <= endDate;
      d = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
      )
    ) {
      if (d < startOfYear) {
        currentWeek.push(null)
        if (d.getUTCDay() === 6) {
          weeks.push(currentWeek)
          currentWeek = []
        }
        continue
      }
      const dateStr = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`
      const dayData = dayMap.get(dateStr)

      currentWeek.push({
        date: dateStr,
        value: dayData ? dayData.totalCost : 0,
        tokens: dayData ? dayData.totalTokens : 0,
        cost: dayData ? dayData.totalCost : 0,
        day: d.getUTCDay(),
        formattedDate: d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC'
        })
      })

      if (d.getUTCDay() === 6 || d.getTime() === endDate.getTime()) {
        while (currentWeek.length < 7) {
          currentWeek.push(null)
        }
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    return weeks
  }

  /**
   * Determines the heatmap color for a given activity value.
   *
   * @param maxCost - Maximum cost value in the dataset (for normalization)
   * @param value - Current day's cost value
   * @param palette - Color palette configuration (empty color + gradient steps)
   * @returns {string} Hex color string
   *
   * @remarks
   * Maps activity values to colors using a multi-step gradient:
   * - Values ≤ 0 return the empty color
   * - Values are normalized to 0-1 range using maxCost
   * - Normalized values are mapped to palette steps
   * - Handles edge cases (division by zero, infinite values)
   *
   * @example
   * ```ts
   * const maxCost = 10.50
   * const dayCost = 7.25
   *
   * // With default palette (brown gradient)
   * const color = AIService.getHeatmapColor(maxCost, dayCost)
   * // Returns: '#8d5738' (upper-mid range color)
   *
   * // With custom palette
   * const customColor = AIService.getHeatmapColor(maxCost, dayCost, {
   *   empty: '#1a1a1a',
   *   steps: ['#fee', '#fcc', '#faa', '#f88', '#f00']
   * })
   * ```
   *
   * @example
   * ```ts
   * // Zero activity
   * AIService.getHeatmapColor(100, 0)  // Returns empty color
   *
   * // Low activity (0-25% of max)
   * AIService.getHeatmapColor(100, 20) // Returns steps[0]
   *
   * // High activity (75-100% of max)
   * AIService.getHeatmapColor(100, 95) // Returns steps[3]
   * ```
   */
  static getHeatmapColor(
    maxCost: number,
    value: number,
    palette: HeatmapPalette = {
      empty: '#1f2937',
      steps: ['#4a3328', '#6b4530', '#8d5738', '#c15f3c']
    }
  ): string {
    if (value <= 0 || maxCost <= 0) return palette.empty

    const ratio = value / maxCost
    if (!Number.isFinite(ratio) || ratio <= 0) {
      return palette.empty
    }

    const steps = palette.steps.length
      ? palette.steps
      : ['#4a3328', '#6b4530', '#8d5738', '#c15f3c']
    const clampedRatio = Math.min(Math.max(ratio, 0), 1)
    const index = Math.min(
      Math.floor(clampedRatio * steps.length),
      steps.length - 1
    )

    return steps[index]
  }

  /**
   * Aggregates model usage data across all daily records.
   *
   * @param daily - Array of daily usage data
   * @returns {ModelUsage[]} Array of model usage with cost, sorted by cost (descending)
   *
   * @remarks
   * Processes model breakdowns to create a cost-based usage summary:
   * - Converts model IDs to human-readable labels
   * - Aggregates costs by model across all days
   * - Calculates percentage of total cost for each model
   * - Sorts by cost (highest first)
   *
   * @example
   * ```ts
   * const modelData = AIService.buildModelUsageData(ccData.daily)
   * // Returns: [
   * //   { name: 'Claude Sonnet 4.5', value: 45.30, percentage: 65.2 },
   * //   { name: 'Claude Opus 4.1', value: 24.15, percentage: 34.8 }
   * // ]
   *
   * // Use for pie charts or model comparison
   * modelData.forEach(model => {
   *   console.log(`${model.name}: $${model.value.toFixed(2)} (${model.percentage.toFixed(1)}%)`)
   * })
   * ```
   */
  static buildModelUsageData(daily: DailyData[]): ModelUsage[] {
    const raw = daily.reduce((acc, day) => {
      if (!day.modelBreakdowns) return acc

      day.modelBreakdowns.forEach((model) => {
        const label = this.getModelLabel(model.modelName)
        const existing = acc.find((m) => m.name === label)
        if (existing) {
          existing.value += model.cost
        } else {
          acc.push({ name: label, value: model.cost })
        }
      })
      return acc
    }, [] as ModelUsage[])

    const sorted = raw.sort((a, b) => b.value - a.value)
    const total = sorted.reduce((sum, m) => sum + m.value, 0)

    return sorted.map((m) => ({
      ...m,
      percentage: total > 0 ? (m.value / total) * 100 : 0
    }))
  }

  /**
   * Breaks down token usage by type (input, output, cache creation, cache read).
   *
   * @param totals - Aggregated totals from CCData
   * @returns {TokenTypeUsage[]} Array of token types with counts and percentages
   *
   * @remarks
   * Creates a distribution analysis of token consumption:
   * - Input tokens (user prompts)
   * - Output tokens (model responses)
   * - Cache creation tokens (new cache entries)
   * - Cache read tokens (cache hits)
   *
   * Useful for understanding token usage patterns and cache effectiveness.
   *
   * @example
   * ```ts
   * const breakdown = AIService.buildTokenTypeData(ccData.totals)
   * // Returns: [
   * //   { name: 'Input', value: 1500000, percentage: 45.5 },
   * //   { name: 'Output', value: 850000, percentage: 25.8 },
   * //   { name: 'Cache Creation', value: 500000, percentage: 15.2 },
   * //   { name: 'Cache Read', value: 450000, percentage: 13.7 }
   * // ]
   *
   * // Calculate cache efficiency
   * const cacheCreation = breakdown.find(t => t.name === 'Cache Creation')
   * const cacheRead = breakdown.find(t => t.name === 'Cache Read')
   * const cacheHitRate = cacheRead / (cacheCreation + cacheRead)
   * ```
   */
  static buildTokenTypeData(totals: CCData['totals']): TokenTypeUsage[] {
    const data = [
      { name: 'Input', value: totals.inputTokens },
      { name: 'Output', value: totals.outputTokens },
      { name: 'Cache Creation', value: totals.cacheCreationTokens },
      { name: 'Cache Read', value: totals.cacheReadTokens }
    ]

    const total = data.reduce((sum, t) => sum + t.value, 0)

    return data.map((t) => ({
      ...t,
      percentage: total > 0 ? (t.value / total) * 100 : 0
    }))
  }

  /**
   * Filters daily data to a specific time range with gap filling.
   *
   * @param daily - Array of daily usage data
   * @param range - Time range key ('7d', '1m', '3m', '6m', '1y', 'all')
   * @param options - Optional configuration
   * @param options.endDate - Custom end date (defaults to last non-empty day)
   * @returns {DailyData[]} Filtered and filled daily data for the specified range
   *
   * @remarks
   * Advanced time-range filtering with intelligent date handling:
   * - **'all'**: Returns all data from first to last day
   * - **'7d'**: Last 7 days (day-based calculation)
   * - **'1m', '3m', '6m', '1y'**: Month-based calculation (handles month-end edge cases)
   * - Fills gaps with empty days for continuous series
   * - Uses last non-empty day as default end date
   * - All date operations in UTC
   *
   * @example
   * ```ts
   * // Get last 30 days of data
   * const last30Days = AIService.filterDailyByRange(ccData.daily, '1m')
   *
   * // Get last 7 days
   * const lastWeek = AIService.filterDailyByRange(ccData.daily, '7d')
   *
   * // Get all historical data
   * const allData = AIService.filterDailyByRange(ccData.daily, 'all')
   *
   * // Custom end date (e.g., for historical analysis)
   * const customRange = AIService.filterDailyByRange(ccData.daily, '1m', {
   *   endDate: new Date('2024-12-31')
   * })
   * ```
   *
   * @example
   * ```ts
   * // Compare costs across different time ranges
   * const ranges: TimeRangeKey[] = ['7d', '1m', '3m']
   * ranges.forEach(range => {
   *   const data = AIService.filterDailyByRange(ccData.daily, range)
   *   const totals = AIService.computeTotalsFromDaily(data)
   *   console.log(`${range}: $${totals.totalCost.toFixed(2)}`)
   * })
   * ```
   */
  static filterDailyByRange(
    daily: DailyData[],
    range: TimeRangeKey,
    options: { endDate?: Date } = {}
  ): DailyData[] {
    if (!daily.length) return []

    const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date))

    let effectiveEnd: Date
    if (options.endDate) {
      effectiveEnd = this.startOfDay(options.endDate)
    } else {
      const lastNonEmptyDay = sorted.filter((d) => d.totalCost > 0).pop()
      const lastDate = lastNonEmptyDay?.date || sorted[sorted.length - 1]?.date
      if (!lastDate) return []
      effectiveEnd = this.startOfDay(new Date(lastDate + 'T00:00:00Z'))
    }

    const trimmed = sorted.filter((day) => {
      const current = new Date(day.date + 'T00:00:00Z')
      return current <= effectiveEnd
    })

    if (!trimmed.length) return []

    const byDate = new Map(trimmed.map((day) => [day.date, day] as const))
    const earliest = this.startOfDay(new Date(trimmed[0].date + 'T00:00:00Z'))

    if (range === 'all') {
      return this.buildFilledRange(earliest, effectiveEnd, byDate)
    }

    const config = this.RANGE_CONFIG[range as Exclude<TimeRangeKey, 'all'>]
    if (!config) {
      return this.buildFilledRange(earliest, effectiveEnd, byDate)
    }

    let start: Date
    if (config.days) {
      start = new Date(
        Date.UTC(
          effectiveEnd.getUTCFullYear(),
          effectiveEnd.getUTCMonth(),
          effectiveEnd.getUTCDate() - (config.days - 1)
        )
      )
    } else {
      start = this.subtractUtcMonths(effectiveEnd, config.months ?? 0)
    }

    if (start > effectiveEnd) {
      start = new Date(effectiveEnd)
    }

    return this.buildFilledRange(start, effectiveEnd, byDate)
  }

  /**
   * Computes aggregate totals from an array of daily data.
   *
   * @param daily - Array of daily usage data
   * @returns {CCData['totals']} Aggregated totals for all metrics
   *
   * @remarks
   * Sums all token and cost metrics across the provided daily data:
   * - Input tokens
   * - Output tokens
   * - Cache creation tokens
   * - Cache read tokens
   * - Total tokens
   * - Total cost
   *
   * Useful for computing subtotals after filtering by time range.
   *
   * @example
   * ```ts
   * // Compute totals for last 30 days
   * const last30Days = AIService.filterDailyByRange(ccData.daily, '1m')
   * const totals = AIService.computeTotalsFromDaily(last30Days)
   *
   * console.log(`Total cost: $${totals.totalCost.toFixed(2)}`)
   * console.log(`Total tokens: ${totals.totalTokens.toLocaleString()}`)
   * console.log(`Cache hit rate: ${(totals.cacheReadTokens / totals.totalTokens * 100).toFixed(1)}%`)
   * ```
   */
  static computeTotalsFromDaily(daily: DailyData[]): CCData['totals'] {
    return daily.reduce<CCData['totals']>(
      (acc, day) => ({
        inputTokens: acc.inputTokens + day.inputTokens,
        outputTokens: acc.outputTokens + day.outputTokens,
        cacheCreationTokens: acc.cacheCreationTokens + day.cacheCreationTokens,
        cacheReadTokens: acc.cacheReadTokens + day.cacheReadTokens,
        totalCost: acc.totalCost + day.totalCost,
        totalTokens: acc.totalTokens + day.totalTokens
      }),
      {
        inputTokens: 0,
        outputTokens: 0,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        totalCost: 0,
        totalTokens: 0
      }
    )
  }

  /**
   * Computes AI usage statistics and analytics.
   *
   * @param data - Complete CCData object with daily data and totals
   * @returns {AIStatsResult} Comprehensive usage statistics
   *
   * @remarks
   * Generates a complete analytics snapshot including:
   * - Current activity streak
   * - Overall totals (cost, tokens)
   * - Time-based averages (daily, last 7 days, last 30 days)
   * - Token type breakdown
   *
   * This is the primary method for dashboard and summary views.
   *
   * @example
   * ```ts
   * const stats = AIService.getAIStats(ccData)
   *
   * // Display overview
   * console.log(`Streak: ${stats.streakFormatted}`)
   * console.log(`Total spent: $${stats.totalCost.toFixed(2)}`)
   * console.log(`Daily average: $${stats.dailyAverage.toFixed(2)}`)
   *
   * // Last 7 days analysis
   * console.log(`Last 7 days: $${stats.last7Days.cost.toFixed(2)}`)
   * console.log(`7-day daily avg: $${stats.last7Days.dailyAverage.toFixed(2)}`)
   *
   * // Token distribution
   * const { input, output, cache } = stats.tokenBreakdown
   * const total = input + output + cache
   * console.log(`Input: ${(input/total*100).toFixed(1)}%`)
   * console.log(`Output: ${(output/total*100).toFixed(1)}%`)
   * console.log(`Cache: ${(cache/total*100).toFixed(1)}%`)
   * ```
   *
   * @example
   * ```ts
   * // Use for dashboard cards
   * const stats = AIService.getAIStats(ccData)
   * return (
   *   <Dashboard>
   *     <StatCard title="Streak" value={stats.streakFormatted} />
   *     <StatCard title="Total Cost" value={`$${stats.totalCost.toFixed(2)}`} />
   *     <StatCard title="Last 7 Days" value={`$${stats.last7Days.cost.toFixed(2)}`} />
   *   </Dashboard>
   * )
   * ```
   */
  static getAIStats(data: CCData): AIStatsResult {
    const streak = this.computeStreak(data.daily)
    const dailyAverage =
      data.daily.length > 0 ? data.totals.totalCost / data.daily.length : 0

    const last7Days = data.daily.slice(-7)
    const last7DaysCost = last7Days.reduce((sum, d) => sum + d.totalCost, 0)
    const last7DaysTokens = last7Days.reduce((sum, d) => sum + d.totalTokens, 0)

    const last30Days = data.daily.slice(-30)
    const last30DaysCost = last30Days.reduce((sum, d) => sum + d.totalCost, 0)
    const last30DaysTokens = last30Days.reduce(
      (sum, d) => sum + d.totalTokens,
      0
    )

    return {
      streak,
      streakFormatted: this.formatStreakCompact(streak),
      totalCost: data.totals.totalCost,
      totalTokens: data.totals.totalTokens,
      dailyAverage,
      last7Days: {
        cost: last7DaysCost,
        tokens: last7DaysTokens,
        dailyAverage:
          last7Days.length > 0 ? last7DaysCost / last7Days.length : 0
      },
      last30Days: {
        cost: last30DaysCost,
        tokens: last30DaysTokens,
        dailyAverage:
          last30Days.length > 0 ? last30DaysCost / last30Days.length : 0
      },
      tokenBreakdown: {
        input: data.totals.inputTokens,
        output: data.totals.outputTokens,
        cache: data.totals.cacheCreationTokens + data.totals.cacheReadTokens
      }
    }
  }
}
