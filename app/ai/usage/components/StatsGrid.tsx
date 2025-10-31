'use client'

import { Totals, DailyData } from '@/lib/types/ai'
import { formatStreakCompact, computeStreak } from './utils'
import type { ToolTheme } from '@/app/ai/theme'
import { surfaces } from '@/lib/theme'
import { Formatter } from '@/lib/utils/formatting'
import { FaFire } from 'react-icons/fa'

interface StatsGridProps {
  totals: Totals
  daily: DailyData[]
  theme: ToolTheme
}

export default function StatsGrid({ totals, daily, theme }: StatsGridProps) {
  const activeDays = daily.filter(
    (day) => day.totalTokens > 0 || day.totalCost > 0
  )
  const streak = computeStreak(activeDays)
  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-4">
      <div className={surfaces.card.ai}>
        <h3 className="mb-2 text-sm font-medium text-gray-400">Total Cost</h3>
        <p
          className="text-3xl font-bold"
          style={{ color: theme.emphasis.cost }}
        >
          ${totals.totalCost.toFixed(2)}
        </p>
      </div>
      <div className={surfaces.card.ai}>
        <h3 className="mb-2 text-sm font-medium text-gray-400">Total Tokens</h3>
        <p
          className="text-3xl font-bold"
          style={{ color: theme.emphasis.cost }}
        >
          {Formatter.tokens(totals.totalTokens)}
        </p>
      </div>
      <div className={surfaces.card.ai}>
        <h3 className="mb-2 text-sm font-medium text-gray-400">Days Active</h3>
        <p
          className="flex items-center text-3xl font-bold"
          style={{ color: theme.emphasis.cost }}
        >
          {activeDays.length}
          <span className="ml-3 flex items-center gap-1.5 rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-gray-50">
            <FaFire className="text-base text-orange-500" />
            {formatStreakCompact(streak)}
          </span>
        </p>
      </div>
      <div className={surfaces.card.ai}>
        <h3 className="mb-2 text-sm font-medium text-gray-400">
          Avg Daily Cost
        </h3>
        <p
          className="text-3xl font-bold"
          style={{ color: theme.emphasis.cost }}
        >
          ${(totals.totalCost / Math.max(daily.length, 1)).toFixed(2)}
        </p>
      </div>
    </div>
  )
}
