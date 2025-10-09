"use client"

import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from 'recharts'
import { DailyData, TimeRangeKey } from '@/lib/types'
import { buildTokenCompositionData, formatAxisLabel, formatTooltipDate } from './utils'
import type { ToolTheme } from '@/app/ai/theme'

const formatWithUnit = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}M`
  } else if (value >= 1) {
    return `${value.toFixed(value >= 100 ? 0 : 1)}K`
  } else {
    return value.toFixed(2)
  }
}

const formatTooltipValue = (value: number, dataKey: string | undefined): string => {
  if (dataKey === 'cacheTokens') {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}B tokens`
    } else if (value >= 1) {
      return `${value.toFixed(2)}M tokens`
    } else {
      return `${(value * 1000).toFixed(0)}K tokens`
    }
  } else {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}M tokens`
    } else if (value >= 1) {
      return `${value.toFixed(1)}K tokens`
    } else {
      return `${(value * 1000).toFixed(0)} tokens`
    }
  }
}

interface TokenCompositionProps {
  daily: DailyData[]
  theme: ToolTheme
  timeRange: TimeRangeKey
}

export default function TokenComposition({ daily, theme, timeRange }: TokenCompositionProps) {
  const tokenCompositionData = buildTokenCompositionData(daily)
  return (
    <section className="p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300 sm:col-span-2">
      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Token Composition</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={tokenCompositionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tickFormatter={(value) => formatAxisLabel(String(value), timeRange)}
            interval={timeRange === '7d' ? 0 : undefined}
            tickMargin={12}
            minTickGap={12}
          />
          <YAxis stroke="#9ca3af" tickFormatter={formatWithUnit} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: number, _name: string, props: any) => formatTooltipValue(value, props?.dataKey)}
            labelFormatter={(value: string) => formatTooltipDate(String(value))}
          />
          <Legend />
          <Bar dataKey="inputTokens" stackId="a" fill={theme.chart.barPrimary} name="Input" />
          <Bar dataKey="outputTokens" stackId="a" fill={theme.chart.barSecondary} name="Output" />
          <Line type="monotone" dataKey="cacheTokens" stroke={theme.chart.line} name="Cache" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  )
}
