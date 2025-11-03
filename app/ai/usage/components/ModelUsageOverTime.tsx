'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { DailyData, TimeRangeKey } from '@/lib/types'
import {
  getModelLabel,
  formatAxisLabel,
  formatTooltipDate,
  formatTokens
} from './utils'
import type { ToolTheme } from '@/app/ai/theme'

const MODEL_COLORS = [
  '#60a5fa',
  '#a78bfa',
  '#f472b6',
  '#fb923c',
  '#34d399',
  '#fbbf24',
  '#f87171',
  '#2dd4bf'
]

const formatYAxis = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}M`
  } else if (value >= 1) {
    return `${value.toFixed(0)}K`
  } else {
    return value.toFixed(1)
  }
}

const buildLineData = (daily: DailyData[]) => {
  const modelsByLabel = new Map<string, Set<string>>()

  daily.forEach((day) => {
    day.modelBreakdowns?.forEach((model) => {
      const label = getModelLabel(model.modelName)
      if (!modelsByLabel.has(label)) {
        modelsByLabel.set(label, new Set())
      }
      modelsByLabel.get(label)!.add(model.modelName)
    })
  })

  const lineData = daily.map((day) => {
    const dataPoint: Record<string, number | string> = {
      date: day.date
    }

    const labelTotals = new Map<string, number>()

    day.modelBreakdowns?.forEach((model) => {
      const label = getModelLabel(model.modelName)
      const totalTokens =
        model.inputTokens +
        model.outputTokens +
        model.cacheCreationTokens +
        model.cacheReadTokens

      const current = labelTotals.get(label) || 0
      labelTotals.set(label, current + totalTokens / 1000)
    })

    labelTotals.forEach((tokens, label) => {
      dataPoint[label] = tokens
    })

    return dataPoint
  })

  const modelTotals = new Map<string, number>()
  modelsByLabel.forEach((_rawNames, label) => {
    const total = lineData.reduce((sum, day) => {
      const value = day[label]
      return sum + (typeof value === 'number' ? value : 0)
    }, 0)
    modelTotals.set(label, total)
  })

  const sortedModels = Array.from(modelTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label]) => label)

  return { lineData, models: sortedModels }
}

interface ModelUsageOverTimeProps {
  daily: DailyData[]
  theme: ToolTheme
  timeRange: TimeRangeKey
}

export default function ModelUsageOverTime({
  daily,
  theme,
  timeRange
}: ModelUsageOverTimeProps) {
  const { lineData, models } = buildLineData(daily)
  const chartColors = [theme.chart.line, ...MODEL_COLORS]

  if (models.length === 0) {
    return (
      <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:p-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
          Model Usage Over Time
        </h2>
        <div className="flex h-[300px] items-center justify-center text-gray-400">
          No model data available for this time period
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:col-span-2 lg:p-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
        Model Usage Over Time
      </h2>
      <div className="h-[300px] sm:h-[350px] lg:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineData}
            margin={{ top: 5, right: 5, bottom: 35, left: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tickFormatter={(value) =>
                formatAxisLabel(String(value), timeRange)
              }
              interval={timeRange === '7d' ? 0 : undefined}
              tickMargin={6}
              minTickGap={20}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis stroke="#9ca3af" tickFormatter={formatYAxis} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                fontSize: '14px'
              }}
              labelStyle={{
                color: '#e5e7eb',
                fontWeight: '600',
                marginBottom: '8px'
              }}
              itemStyle={{
                color: '#9ca3af',
                padding: '4px 0'
              }}
              labelFormatter={(value: string) =>
                formatTooltipDate(String(value))
              }
              formatter={(value: number) => formatTokens(value * 1000)}
              cursor={{ stroke: '#374151', strokeWidth: 1 }}
              wrapperStyle={{ pointerEvents: 'none' }}
            />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '4px', bottom: 0 }}
              iconType="line"
              formatter={(value: string) => (
                <span className="text-sm text-gray-300">{value}</span>
              )}
            />
            {models.map((modelName, index) => (
              <Line
                key={modelName}
                type="monotone"
                dataKey={modelName}
                name={modelName}
                stroke={chartColors[index % chartColors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
