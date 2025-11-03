'use client'

import { useEffect, useState, useMemo } from 'react'
import PageShell from '@/components/layout/PageShell'
import LoadingSkeleton from './components/LoadingSkeleton'
import PageHeader from './components/PageHeader'
import ProviderFilter from './components/ProviderFilter'
import StatsGrid from './components/StatsGrid'
import Activity from './components/Activity'
import ModelUsageCard from './components/ModelUsageCard'
import TokenType from './components/TokenType'
import TokenComposition from './components/TokenComposition'
import ModelUsageOverTime from './components/ModelUsageOverTime'
import RecentSessions from './components/RecentSessions'
import TimeRangeFilter from './components/TimeRangeFilter'
import { filterDailyByRange, computeTotalsFromDaily } from './components/utils'
import type {
  ExtendedCCData,
  CCData,
  TimeRangeKey,
  DailyData
} from '@/lib/types/ai'
import { getToolTheme, type ProviderId } from '@/app/ai/theme'

export default function Usage() {
  const [data, setData] = useState<ExtendedCCData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('all')
  const [timeRange, setTimeRange] = useState<TimeRangeKey>(() => {
    const envValue = process.env.NEXT_PUBLIC_DEFAULT_TIME_RANGE as TimeRangeKey
    return envValue || '3m'
  })

  const sortedAllDaily = useMemo<DailyData[]>(() => {
    if (!data) return []

    const normalizeDaily = (entry: DailyData): DailyData => ({
      ...entry,
      modelsUsed: entry.modelsUsed ?? [],
      modelBreakdowns: entry.modelBreakdowns ?? []
    })

    const dateMap = new Map<string, DailyData>()

    const mergeProviderEntries = (entries: DailyData[]) => {
      for (const entry of entries) {
        const existing = dateMap.get(entry.date)
        if (existing) {
          existing.inputTokens += entry.inputTokens
          existing.outputTokens += entry.outputTokens
          existing.cacheCreationTokens += entry.cacheCreationTokens
          existing.cacheReadTokens += entry.cacheReadTokens
          existing.totalTokens += entry.totalTokens
          existing.totalCost += entry.totalCost

          const modelsSet = new Set([
            ...existing.modelsUsed,
            ...(entry.modelsUsed ?? [])
          ])
          existing.modelsUsed = Array.from(modelsSet)

          const breakdownMap = new Map(
            existing.modelBreakdowns.map((m) => [m.modelName, { ...m }])
          )

          for (const breakdown of entry.modelBreakdowns ?? []) {
            const existingBreakdown = breakdownMap.get(breakdown.modelName)
            if (existingBreakdown) {
              existingBreakdown.inputTokens += breakdown.inputTokens
              existingBreakdown.outputTokens += breakdown.outputTokens
              existingBreakdown.cacheCreationTokens +=
                breakdown.cacheCreationTokens
              existingBreakdown.cacheReadTokens += breakdown.cacheReadTokens
              existingBreakdown.cost += breakdown.cost
            } else {
              breakdownMap.set(breakdown.modelName, { ...breakdown })
            }
          }

          existing.modelBreakdowns = Array.from(breakdownMap.values())
        } else {
          dateMap.set(entry.date, normalizeDaily(entry))
        }
      }
    }

    if (data.claudeCode?.daily) mergeProviderEntries(data.claudeCode.daily)
    if (data.codex?.daily) mergeProviderEntries(data.codex.daily)
    if (data.opencode?.daily) mergeProviderEntries(data.opencode.daily)
    if (data.qwen?.daily) mergeProviderEntries(data.qwen.daily)
    if (data.gemini?.daily) mergeProviderEntries(data.gemini.daily)

    return Array.from(dateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    )
  }, [data])

  const globalEndDate = useMemo<Date | null>(() => {
    if (!sortedAllDaily.length) return null
    const last = sortedAllDaily[sortedAllDaily.length - 1]
    return new Date(last.date + 'T00:00:00Z')
  }, [sortedAllDaily])

  useEffect(() => {
    fetch('/data/cc.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data')
        return res.json()
      })
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const providerScopedData = useMemo<CCData | null>(() => {
    if (!data) return null

    const baseDaily = sortedAllDaily
    const createEmptyDay = (date: string): DailyData => ({
      date,
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0,
      totalTokens: 0,
      totalCost: 0,
      modelsUsed: [],
      modelBreakdowns: []
    })

    // Handle individual provider selection
    if (selectedProvider !== 'all') {
      const providerData = data[selectedProvider]
      if (providerData) {
        const byDate = new Map(
          providerData.daily.map((day) => [day.date, day] as const)
        )
        const normalizedDaily = baseDaily.map(
          (day) => byDate.get(day.date) ?? createEmptyDay(day.date)
        )
        return {
          daily: normalizedDaily,
          totals: providerData.totals
        }
      }
    }

    const totals = data.totals || computeTotalsFromDaily(baseDaily)

    return {
      daily: baseDaily,
      totals
    }
  }, [data, selectedProvider, sortedAllDaily])

  const filteredData = useMemo<CCData | null>(() => {
    if (!providerScopedData) return null

    const scopedDaily = filterDailyByRange(
      providerScopedData.daily,
      timeRange,
      {
        endDate: globalEndDate ?? undefined
      }
    )
    const totals =
      timeRange === 'all'
        ? providerScopedData.totals
        : computeTotalsFromDaily(scopedDaily)

    return {
      daily: scopedDaily,
      totals
    }
  }, [providerScopedData, timeRange, globalEndDate])

  const theme = getToolTheme(selectedProvider)

  if (loading) {
    return (
      <LoadingSkeleton
        theme={theme}
        selectedProvider={selectedProvider}
        timeRange={timeRange}
      />
    )
  }

  if (error || !data || !filteredData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-red-400">Error loading data: {error}</div>
      </div>
    )
  }

  return (
    <PageShell variant="full-width">
      <PageHeader selectedProvider={selectedProvider} theme={theme} />

      <div className="mb-6 px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-4">
          <ProviderFilter
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
            hasClaudeCode={!!data.claudeCode}
            hasCodex={!!data.codex}
            hasOpencode={!!data.opencode}
            hasQwen={!!data.qwen}
            hasGemini={!!data.gemini}
            theme={theme}
            className="w-full sm:w-auto"
          />
          <TimeRangeFilter
            value={timeRange}
            onChange={setTimeRange}
            theme={theme}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <StatsGrid
        totals={filteredData.totals}
        daily={filteredData.daily}
        theme={theme}
      />

      <div className="px-4 pt-4">
        <Activity
          daily={filteredData.daily}
          theme={theme}
          timeRange={timeRange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 pt-4 lg:grid-cols-2">
        <ModelUsageCard daily={filteredData.daily} theme={theme} />
        <TokenType totals={filteredData.totals} theme={theme} />
      </div>

      <div className="px-4 pt-4">
        <ModelUsageOverTime
          daily={filteredData.daily}
          theme={theme}
          timeRange={timeRange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2">
        <TokenComposition daily={filteredData.daily} theme={theme} />
        <RecentSessions daily={filteredData.daily} theme={theme} />
      </div>
    </PageShell>
  )
}
