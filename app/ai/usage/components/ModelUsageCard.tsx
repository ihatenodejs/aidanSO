'use client'

import { useState, useMemo } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { TooltipProps } from 'recharts'
import type {
  Payload,
  ValueType,
  NameType
} from 'recharts/types/component/DefaultTooltipContent'
import { DailyData } from '@/lib/types'
import {
  buildModelUsageData,
  buildModelUsageDataByTokens,
  formatCurrency,
  formatTokens
} from './utils'
import type { ToolTheme } from '@/app/ai/theme'

type ModelTooltipProps = TooltipProps<ValueType, NameType> & {
  payload?: readonly Payload<ValueType, NameType>[]
}

interface ModelUsageCardProps {
  daily: DailyData[]
  theme: ToolTheme
}

export default function ModelUsageCard({ daily, theme }: ModelUsageCardProps) {
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'tokens'>(
    'tokens'
  )

  const modelUsageData = useMemo(() => {
    return selectedMetric === 'cost'
      ? buildModelUsageData(daily)
      : buildModelUsageDataByTokens(daily)
  }, [daily, selectedMetric])

  const palette = theme.chart.pie

  const renderTooltip = ({ active, payload }: ModelTooltipProps) => {
    if (!active || !payload?.length) return null

    const [firstEntry] = payload
    const dataPoint = (firstEntry?.payload ?? null) as
      | (typeof modelUsageData)[number]
      | null
    const rawValue = Number(firstEntry?.value ?? 0)
    const formattedValue =
      selectedMetric === 'cost'
        ? formatCurrency(rawValue)
        : `${formatTokens(rawValue)} tokens`
    const percentage = dataPoint?.percentage ?? 0
    const modelName = dataPoint?.name ?? 'Unknown Model'

    return (
      <div
        className="rounded-md border border-gray-700 bg-gray-900/95 px-3 py-2 text-sm text-gray-100 shadow-lg backdrop-blur-sm"
        style={{
          animation: 'tooltipFadeIn 200ms ease-out'
        }}
      >
        <p className="font-medium">{modelName}</p>
        <p className="text-xs text-gray-400">
          {percentage.toFixed(1)}% · {formattedValue}
        </p>
      </div>
    )
  }

  return (
    <section className="col-span-2 rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:col-span-1 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-200 sm:text-2xl">
          Model Usage Distribution
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric('tokens')}
            className={`rounded px-3 py-1 text-sm transition-colors ${selectedMetric === 'tokens' ? '' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            style={
              selectedMetric === 'tokens'
                ? {
                    backgroundColor: theme.button.activeBackground,
                    color: theme.button.activeText
                  }
                : undefined
            }
          >
            Tokens
          </button>
          <button
            onClick={() => setSelectedMetric('cost')}
            className={`rounded px-3 py-1 text-sm transition-colors ${selectedMetric === 'cost' ? '' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            style={
              selectedMetric === 'cost'
                ? {
                    backgroundColor: theme.button.activeBackground,
                    color: theme.button.activeText
                  }
                : undefined
            }
          >
            Cost
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[250px] lg:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modelUsageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                isAnimationActive={false}
              >
                {modelUsageData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={palette[index % palette.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} animationDuration={0} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center space-y-3">
          {modelUsageData.map((model, index) => {
            const displayValue =
              selectedMetric === 'cost'
                ? `$${model.value.toFixed(2)}`
                : formatTokens(model.value)
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: palette[index % palette.length] }}
                  />
                  <span className="text-xs font-medium text-gray-300">
                    {model.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {(model.percentage ?? 0).toFixed(1)}%
                  </span>
                  <span className="font-semibold text-gray-200">
                    {displayValue}
                  </span>
                </div>
              </div>
            )
          })}
          <div className="mt-3 border-t border-gray-700 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Models Used</span>
              <span className="font-bold text-gray-200">
                {modelUsageData.length}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-gray-400">Most Used</span>
              <span className="text-xs font-bold text-gray-200">
                {modelUsageData[0]?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
