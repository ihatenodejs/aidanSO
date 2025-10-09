"use client"

import { Totals, DailyData } from '@/lib/types/ai'
import { formatStreakCompact, computeStreak } from './utils'
import type { ToolTheme } from '@/app/ai/theme'
import { surfaces } from '@/lib/theme'

interface StatsGridProps {
  totals: Totals
  daily: DailyData[]
  theme: ToolTheme
}

export default function StatsGrid({ totals, daily, theme }: StatsGridProps) {
  const activeDays = daily.filter(day => day.totalTokens > 0 || day.totalCost > 0)
  const streak = computeStreak(activeDays)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4">
      <div className={surfaces.card.ai}>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Total Cost</h3>
        <p className="text-3xl font-bold" style={{ color: theme.emphasis.cost }}>
          ${totals.totalCost.toFixed(2)}
        </p>
      </div>
      <div className={surfaces.card.ai}>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Total Tokens</h3>
        <p className="text-3xl font-bold" style={{ color: theme.emphasis.cost }}>
          {(totals.totalTokens / 1000000).toFixed(1)}M
        </p>
      </div>
      <div className={surfaces.card.ai}>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Days Active</h3>
        <p className="text-3xl font-bold flex items-center" style={{ color: theme.emphasis.cost }}>
          {activeDays.length}
          <span className="ml-3 text-xs font-semibold text-gray-300 bg-gray-800 px-2 py-0.5 rounded-full">
            🔥 {formatStreakCompact(streak)}
          </span>
        </p>
      </div>
      <div className={surfaces.card.ai}>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Daily Cost</h3>
        <p className="text-3xl font-bold" style={{ color: theme.emphasis.cost }}>
          ${(totals.totalCost / Math.max(daily.length, 1)).toFixed(2)}
        </p>
      </div>
    </div>
  )
}
