import { CCData, DailyData, HeatmapDay, TimeRangeKey } from '@/lib/types'
import { AIService } from '@/lib/services'
import { Formatter } from '@/lib/utils/formatting'
import type { HeatmapPalette } from '@/app/ai/theme'

export const getModelLabel = (modelName: string): string => {
  return AIService.getModelLabel(modelName)
}

/**
 * Formats a number as USD currency.
 *
 * @remarks
 * Simple currency formatter for AI usage cost display.
 * Formats to 2 decimal places with dollar sign prefix.
 *
 * @param value - Numeric value to format as currency
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrency(123.456) // Returns "$123.46"
 * ```
 *
 * @category AI Usage
 * @public
 */
export const formatCurrency = (value: number) => `$${value.toFixed(2)}`
/**
 * Formats token count for human-readable display.
 *
 * @remarks
 * Wrapper around Formatter.tokens for consistent token formatting
 * in AI usage components. Converts large numbers to abbreviated format.
 *
 * @param value - Token count to format
 * @returns Formatted token string
 *
 * @example
 * ```ts
 * formatTokens(1500000) // Returns "1.5M"
 * ```
 *
 * @category AI Usage
 * @public
 */
export const formatTokens = (value: number) => Formatter.tokens(value)

export const computeStreak = (daily: DailyData[]): number => {
  return AIService.computeStreak(daily)
}

/**
 * Formats streak count in compact notation.
 *
 * @remarks
 * Wrapper around AIService.formatStreakCompact for consistent
 * streak formatting in AI usage components.
 *
 * @param days - Number of days in streak
 * @returns Formatted streak string
 *
 * @example
 * ```ts
 * formatStreakCompact(365) // Returns "1y"
 * ```
 *
 * @category AI Usage
 * @public
 */
export const formatStreakCompact = (days: number) => {
  return AIService.formatStreakCompact(days)
}

export const computeFilledDailyRange = (daily: DailyData[]): DailyData[] => {
  return AIService.computeFilledDailyRange(daily)
}

/**
 * Builds daily trend data with normalized token values for UI display.
 *
 * @remarks
 * Wraps the AIService.buildDailyTrendData method and normalizes token values
 * to millions for better readability in the UI components. Includes cost and
 * token trend calculations for time-series visualization.
 *
 * @param daily - Array of daily usage data
 * @returns Daily trend data with normalized values and trend indicators
 *
 * @category AI Usage
 * @public
 */
export const buildDailyTrendData = (daily: DailyData[]) => {
  const trendData = AIService.buildDailyTrendData(daily)
  return trendData.map((day) => ({
    date: day.date,
    cost: day.totalCost,
    tokens: day.totalTokens / 1000000,
    inputTokens: day.inputTokensNormalized,
    outputTokens: day.outputTokensNormalized,
    cacheTokens: day.cacheTokensNormalized,
    costTrend: day.costTrend,
    tokensTrend: day.tokensTrend
  }))
}

export const prepareHeatmapData = (
  daily: DailyData[]
): (HeatmapDay | null)[][] => {
  return AIService.prepareHeatmapData(daily)
}

/**
 * Determines heatmap color based on value intensity.
 *
 * @remarks
 * Wrapper around AIService.getHeatmapColor for consistent
 * heatmap color calculation in AI usage visualizations.
 *
 * @param maxCost - Maximum cost value for color scaling
 * @param value - Current value to determine color for
 * @param palette - Color palette for heatmap
 * @returns Color string from palette
 *
 * @category AI Usage
 * @public
 */
export const getHeatmapColor = (
  maxCost: number,
  value: number,
  palette: HeatmapPalette
) => {
  return AIService.getHeatmapColor(maxCost, value, palette)
}

/**
 * Builds model usage data from daily records.
 *
 * @remarks
 * Wrapper around AIService.buildModelUsageData for consistent
 * model usage data processing in AI usage components.
 *
 * @param daily - Array of daily usage data
 * @returns Processed model usage data
 *
 * @category AI Usage
 * @public
 */
export const buildModelUsageData = (daily: DailyData[]) => {
  return AIService.buildModelUsageData(daily)
}

/**
 * Builds model usage data organized by token consumption.
 *
 * @remarks
 * Processes daily usage data to create model breakdowns
 * sorted by token usage for visualization and analysis.
 *
 * @param daily - Array of daily usage data
 * @returns Model usage data sorted by token consumption
 *
 * @category AI Usage
 * @public
 */
export const buildModelUsageDataByTokens = (daily: DailyData[]) => {
  const raw = daily.reduce(
    (acc, day) => {
      if (!day.modelBreakdowns) return acc

      day.modelBreakdowns.forEach((model) => {
        const label = getModelLabel(model.modelName)
        const existing = acc.find((m) => m.name === label)
        const totalTokens =
          model.inputTokens +
          model.outputTokens +
          model.cacheCreationTokens +
          model.cacheReadTokens
        if (existing) {
          existing.value += totalTokens
        } else {
          acc.push({ name: label, value: totalTokens })
        }
      })
      return acc
    },
    [] as Array<{ name: string; value: number }>
  )

  const sorted = raw.sort((a, b) => b.value - a.value)
  const total = sorted.reduce((sum, m) => sum + m.value, 0)

  return sorted.map((m) => ({
    ...m,
    percentage: total > 0 ? (m.value / total) * 100 : 0
  }))
}

/**
 * Builds token type usage data from totals.
 *
 * @remarks
 * Wrapper around AIService.buildTokenTypeData for consistent
 * token type data processing in AI usage components.
 *
 * @param totals - Totals data from CCData containing token breakdowns
 * @returns Token type usage data
 *
 * @category AI Usage
 * @public
 */
export const buildTokenTypeData = (totals: CCData['totals']) => {
  return AIService.buildTokenTypeData(totals)
}

/**
 * Builds token composition data from daily records.
 *
 * @remarks
 * Wrapper around AIService.buildTokenCompositionData for consistent
 * token composition data processing in AI usage components.
 *
 * @param daily - Array of daily usage data
 * @returns Token composition data
 *
 * @category AI Usage
 * @public
 */
export const buildTokenCompositionData = (daily: DailyData[]) => {
  return AIService.buildTokenCompositionData(daily)
}

/**
 * Filters daily data by time range.
 *
 * @remarks
 * Wrapper around AIService.filterDailyByRange for consistent
 * time-based filtering in AI usage components.
 *
 * @param daily - Array of daily usage data
 * @param range - Time range key (1d, 1w, 1m, 3m, 6m, 1y, all)
 * @param options - Optional filtering configuration
 * @param options.endDate - Custom end date for filtering
 * @returns Filtered daily data array
 *
 * @category AI Usage
 * @public
 */
export const filterDailyByRange = (
  daily: DailyData[],
  range: TimeRangeKey,
  options?: { endDate?: Date }
) => {
  return AIService.filterDailyByRange(daily, range, options)
}

/**
 * Computes totals from daily usage data.
 *
 * @remarks
 * Wrapper around AIService.computeTotalsFromDaily for consistent
 * totals calculation in AI usage components.
 *
 * @param daily - Array of daily usage data
 * @returns Computed totals from daily data
 *
 * @category AI Usage
 * @public
 */
export const computeTotalsFromDaily = (daily: DailyData[]) => {
  return AIService.computeTotalsFromDaily(daily)
}

const toLocalDate = (isoDate: string) => new Date(`${isoDate}T00:00:00`)

export const formatTooltipDate = (isoDate: string): string => {
  const date = toLocalDate(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatAxisLabel = (
  isoDate: string,
  range: TimeRangeKey
): string => {
  const date = toLocalDate(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate

  switch (range) {
    case '7d':
      return date.toLocaleDateString(undefined, {
        weekday: 'long'
      })
    case '1m':
    case '3m':
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    case '6m':
      return date.toLocaleDateString(undefined, {
        month: 'short'
      })
    case '1y':
      return date.toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric'
      })
    default:
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
  }
}
