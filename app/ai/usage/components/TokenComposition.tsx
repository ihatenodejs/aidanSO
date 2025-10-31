'use client'

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts'
import { DailyData } from '@/lib/types'
import type { ToolTheme } from '@/app/ai/theme'

const formatTooltipValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}B tokens`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}M tokens`
  } else {
    return `${value.toFixed(0)}K tokens`
  }
}

const buildRadarData = (daily: DailyData[]) => {
  const totals = daily.reduce(
    (acc, day) => ({
      inputTokens: acc.inputTokens + day.inputTokens,
      outputTokens: acc.outputTokens + day.outputTokens,
      cacheCreationTokens: acc.cacheCreationTokens + day.cacheCreationTokens,
      cacheReadTokens: acc.cacheReadTokens + day.cacheReadTokens
    }),
    {
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0
    }
  )

  return [
    {
      category: 'Input',
      value: totals.inputTokens
    },
    {
      category: 'Output',
      value: totals.outputTokens
    },
    {
      category: 'Cache Write',
      value: totals.cacheCreationTokens
    },
    {
      category: 'Cache Read',
      value: totals.cacheReadTokens
    }
  ]
}

interface TokenCompositionProps {
  daily: DailyData[]
  theme: ToolTheme
}

export default function TokenComposition({
  daily,
  theme
}: TokenCompositionProps) {
  const radarData = buildRadarData(daily)

  return (
    <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:p-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
        Token Composition
      </h2>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
            <PolarRadiusAxis stroke="#9ca3af" angle={90} tick={false} />
            <Radar
              name="Token Distribution"
              dataKey="value"
              stroke={theme.chart.line}
              fill={theme.chart.barPrimary}
              fillOpacity={0.7}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                fontSize: '14px'
              }}
              labelStyle={{
                color: '#e5e7eb',
                fontWeight: '600',
                marginBottom: '4px'
              }}
              itemStyle={{
                color: '#9ca3af',
                padding: '2px 0'
              }}
              formatter={(value: number) => formatTooltipValue(value)}
              cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
              wrapperStyle={{ pointerEvents: 'none' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
