import { CCData, DailyData, HeatmapDay, TimeRangeKey } from '@/lib/types'
import { AIService } from '@/lib/services'
import { Formatter } from '@/lib/utils/formatting'
import type { HeatmapPalette } from '@/app/ai/theme'

export const getModelLabel = (modelName: string): string => {
  return AIService.getModelLabel(modelName)
}

export const formatCurrency = (value: number) => `$${value.toFixed(2)}`
export const formatTokens = (value: number) => Formatter.tokens(value)

export const computeStreak = (daily: DailyData[]): number => {
  return AIService.computeStreak(daily)
}

export const formatStreakCompact = (days: number) => {
  return AIService.formatStreakCompact(days)
}

export const computeFilledDailyRange = (daily: DailyData[]): DailyData[] => {
  return AIService.computeFilledDailyRange(daily)
}

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

export const getHeatmapColor = (
  maxCost: number,
  value: number,
  palette: HeatmapPalette
) => {
  return AIService.getHeatmapColor(maxCost, value, palette)
}

export const buildModelUsageData = (daily: DailyData[]) => {
  return AIService.buildModelUsageData(daily)
}

export const buildTokenTypeData = (totals: CCData['totals']) => {
  return AIService.buildTokenTypeData(totals)
}

export const buildTokenCompositionData = (daily: DailyData[]) => {
  return AIService.buildTokenCompositionData(daily)
}

export const filterDailyByRange = (
  daily: DailyData[],
  range: TimeRangeKey,
  options?: { endDate?: Date }
) => {
  return AIService.filterDailyByRange(daily, range, options)
}

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
