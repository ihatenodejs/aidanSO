"use client"

import { useEffect, useState, useMemo } from 'react'
import LoadingSkeleton from './components/LoadingSkeleton'
import PageHeader from './components/PageHeader'
import ProviderFilter from './components/ProviderFilter'
import StatsGrid from './components/StatsGrid'
import Activity from './components/Activity'
import ModelUsageCard from './components/ModelUsageCard'
import TokenType from './components/TokenType'
import TokenComposition from './components/TokenComposition'
import RecentSessions from './components/RecentSessions'
import TimeRangeFilter from './components/TimeRangeFilter'
import { filterDailyByRange, computeTotalsFromDaily } from './components/utils'
import type { ExtendedCCData, CCData, TimeRangeKey, DailyData } from '@/lib/types/ai'
import { getToolTheme } from '@/app/ai/theme'

export default function Usage() {
  const [data, setData] = useState<ExtendedCCData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'claudeCode' | 'codex'>('all')
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('1m')

  const sortedAllDaily = useMemo<DailyData[]>(() => {
    if (!data) return []

    const dateMap = new Map<string, DailyData>()

    if (data.claudeCode?.daily) {
      for (const entry of data.claudeCode.daily) {
        dateMap.set(entry.date, { ...entry })
      }
    }

    if (data.codex?.daily) {
      for (const entry of data.codex.daily) {
        const existing = dateMap.get(entry.date)
        if (existing) {
          existing.inputTokens += entry.inputTokens
          existing.outputTokens += entry.outputTokens
          existing.cacheCreationTokens += entry.cacheCreationTokens
          existing.cacheReadTokens += entry.cacheReadTokens
          existing.totalTokens += entry.totalTokens
          existing.totalCost += entry.totalCost
          existing.modelsUsed = [...existing.modelsUsed, ...entry.modelsUsed]
          existing.modelBreakdowns = [...existing.modelBreakdowns, ...entry.modelBreakdowns]
        } else {
          dateMap.set(entry.date, { ...entry })
        }
      }
    }

    return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  const globalEndDate = useMemo<Date | null>(() => {
    if (!sortedAllDaily.length) return null
    const last = sortedAllDaily[sortedAllDaily.length - 1]
    return new Date(last.date + 'T00:00:00Z')
  }, [sortedAllDaily])

  useEffect(() => {
    fetch('/data/cc.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data')
        return res.json()
      })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
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
      modelBreakdowns: [],
    })

    if (selectedProvider === 'claudeCode' && data.claudeCode) {
      const byDate = new Map(data.claudeCode.daily.map(day => [day.date, day] as const))
      const normalizedDaily = baseDaily.map(day => byDate.get(day.date) ?? createEmptyDay(day.date))
      return {
        daily: normalizedDaily,
        totals: data.claudeCode.totals,
      }
    }

    if (selectedProvider === 'codex' && data.codex) {
      const byDate = new Map(data.codex.daily.map(day => [day.date, day] as const))
      const normalizedDaily = baseDaily.map(day => byDate.get(day.date) ?? createEmptyDay(day.date))
      return {
        daily: normalizedDaily,
        totals: data.codex.totals,
      }
    }

    const totals = data.totals || computeTotalsFromDaily(baseDaily)

    return {
      daily: baseDaily,
      totals,
    }
  }, [data, selectedProvider, sortedAllDaily])

  const filteredData = useMemo<CCData | null>(() => {
    if (!providerScopedData) return null

    const scopedDaily = filterDailyByRange(providerScopedData.daily, timeRange, {
      endDate: globalEndDate ?? undefined,
    })
    const totals = timeRange === 'all'
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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-400">Error loading data: {error}</div>
      </div>
    )
  }

  return (
    <div className="w-full relative">
        <PageHeader selectedProvider={selectedProvider} theme={theme} />

        <div className="mb-6 px-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div aria-hidden="true" />
            <div className="justify-self-center">
              <ProviderFilter
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
                hasClaudeCode={!!data.claudeCode}
                hasCodex={!!data.codex}
                theme={theme}
              />
            </div>
            <div className="justify-self-end">
              <TimeRangeFilter
                value={timeRange}
                onChange={setTimeRange}
                theme={theme}
              />
            </div>
          </div>
        </div>

        <StatsGrid totals={filteredData.totals} daily={filteredData.daily} theme={theme} />

        <div className="p-4 pb-0">
          <Activity daily={filteredData.daily} theme={theme} timeRange={timeRange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <ModelUsageCard daily={filteredData.daily} totalCost={filteredData.totals.totalCost} theme={theme} />
          <TokenType totals={filteredData.totals} theme={theme} />
          <TokenComposition daily={filteredData.daily} theme={theme} timeRange={timeRange} />
        </div>

        <div className="px-4 pb-4">
          <RecentSessions daily={filteredData.daily} theme={theme} />
        </div>
    </div>
  )
}
