'use client'

import { DailyData } from '@/lib/types'
import { getModelLabel } from './utils'
import type { ToolTheme } from '@/app/ai/theme'

/**
 * @public
 */
export interface RecentSessionsProps {
  daily: DailyData[]
  theme: ToolTheme
}

export default function RecentSessions({ daily, theme }: RecentSessionsProps) {
  const sessions = daily.filter(
    (day) => day.totalTokens > 0 || day.totalCost > 0
  )
  const rows = sessions.slice(-5).reverse()

  return (
    <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:p-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
        Recent Sessions
      </h2>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-2 text-gray-400">Date</th>
              <th className="px-4 py-2 text-gray-400">Models Used</th>
              <th className="px-4 py-2 text-gray-400">Total Tokens</th>
              <th className="px-4 py-2 text-gray-400">Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No sessions in this range.
                </td>
              </tr>
            ) : (
              rows.map((day, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="px-4 py-2 text-gray-300">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {day.modelsUsed.map(getModelLabel).join(', ')}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {(day.totalTokens / 1000000).toFixed(2)}M
                  </td>
                  <td
                    className="px-4 py-2 font-semibold"
                    style={{ color: theme.emphasis.cost }}
                  >
                    ${day.totalCost.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {rows.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No sessions in this range.
          </div>
        ) : (
          rows.map((day, index) => (
            <div
              key={index}
              className="space-y-2 rounded-lg border border-gray-700 p-4"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-400">
                  {new Date(day.date + 'T00:00:00').toLocaleDateString()}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: theme.emphasis.cost }}
                >
                  ${day.totalCost.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-300">
                {day.modelsUsed.map(getModelLabel).join(', ')}
              </div>
              <div className="text-sm text-gray-400">
                {(day.totalTokens / 1000000).toFixed(2)}M tokens
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
