'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { DailyData, TimeRangeKey } from '@/lib/types'
import {
  buildDailyTrendData,
  formatCurrency,
  formatTokens,
  getHeatmapColor,
  prepareHeatmapData,
  formatAxisLabel,
  formatTooltipDate
} from './utils'
import type { ToolTheme } from '@/app/ai/theme'
import { Formatter } from '@/lib/utils/formatting'

/**
 * @public
 */
export interface ActivityProps {
  daily: DailyData[]
  theme: ToolTheme
  timeRange: TimeRangeKey
}

export default function Activity({ daily, theme, timeRange }: ActivityProps) {
  const [viewMode, setViewMode] = useState<'heatmap' | 'chart'>('chart')
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'tokens'>(
    'tokens'
  )

  const dailyTrendData = useMemo(() => buildDailyTrendData(daily), [daily])
  const heatmapWeeks = useMemo(() => prepareHeatmapData(daily), [daily])
  const maxCost = useMemo(
    () => (daily.length ? Math.max(...daily.map((d) => d.totalCost)) : 0),
    [daily]
  )

  const toggleStyles = {
    '--ring-color': theme.focusRing,
    '--knob-color': theme.button.activeBackground
  } as React.CSSProperties

  const heatmapLegendColors = useMemo(
    () => [theme.heatmap.empty, ...theme.heatmap.steps],
    [theme]
  )

  const xAxisFormatter = useCallback(
    (value: string) => formatAxisLabel(String(value), timeRange),
    [timeRange]
  )

  const tooltipLabelFormatter = useCallback(
    (value: string) => formatTooltipDate(String(value)),
    []
  )

  const tooltipFormatter = useCallback(
    (value: number | string, name: string) => {
      const isTrend = name === 'Trend'
      const label = isTrend
        ? selectedMetric === 'cost'
          ? 'Cost Trend'
          : 'Token Trend'
        : selectedMetric === 'cost'
          ? 'Daily Cost'
          : 'Daily Tokens'

      if (typeof value !== 'number') {
        return ['—', label]
      }

      if (selectedMetric === 'cost') {
        return [formatCurrency(value), label]
      }

      const tokenValue = value * 1000000
      return [`${formatTokens(tokenValue)} tokens`, label]
    },
    [selectedMetric]
  )

  return (
    <section className="relative rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 md:col-span-2 lg:col-span-1 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-200 sm:text-2xl">
          Activity
        </h2>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="text-sm text-gray-400">
            {viewMode === 'heatmap' ? 'Heatmap' : 'Chart'}
          </span>
          <button
            onClick={() =>
              setViewMode(viewMode === 'heatmap' ? 'chart' : 'heatmap')
            }
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            style={toggleStyles}
          >
            <span className="sr-only">Toggle view mode</span>
            <span
              className={`${viewMode === 'chart' ? 'translate-x-1' : 'translate-x-6'} inline-block h-4 w-4 transform rounded-full transition-transform`}
              style={{ backgroundColor: theme.button.activeBackground }}
            />
          </button>
        </div>
      </div>
      {viewMode === 'heatmap' ? (
        <div className="hidden overflow-x-auto pb-6 sm:block">
          <div className="min-w-[900px] lg:min-w-0">
            <div className="flex gap-1">
              <div className="flex w-10 flex-col gap-1 pr-2 text-xs text-gray-400">
                <div className="h-4"></div>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <div
                      key={day}
                      className="flex h-4 items-center justify-end text-[10px]"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="relative">
                <div className="mb-1 h-4 text-xs text-gray-400">
                  {(() => {
                    const monthLabels: { month: string; position: number }[] =
                      []
                    let lastMonth = -1
                    heatmapWeeks.forEach((week, weekIndex) => {
                      const firstDay = week.find((d) => d !== null)
                      if (firstDay) {
                        const date = new Date(firstDay.date + 'T00:00:00Z')
                        const month = date.getUTCMonth()
                        if (month !== lastMonth) {
                          monthLabels.push({
                            month: date.toLocaleDateString('en-US', {
                              month: 'short',
                              timeZone: 'UTC'
                            }),
                            position: weekIndex * 20
                          })
                          lastMonth = month
                        }
                      }
                    })
                    return (
                      <div className="relative flex">
                        {monthLabels.map((label, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'absolute',
                              left: label.position
                            }}
                            className="w-10"
                          >
                            {label.month}
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
                <div className="flex gap-1">
                  {heatmapWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div key={dayIndex} className="group relative">
                          <div
                            className="h-4 w-4 rounded-sm"
                            style={{
                              backgroundColor: getHeatmapColor(
                                maxCost,
                                day?.value || 0,
                                theme.heatmap
                              )
                            }}
                          />
                          {day && (
                            <div className="invisible absolute -top-2 left-6 z-10 group-hover:visible">
                              <div className="rounded-lg border border-gray-700 bg-gray-900 p-2 whitespace-nowrap shadow-lg">
                                <p className="mb-1 text-xs font-medium text-gray-300">
                                  {day.formattedDate}
                                </p>
                                <p
                                  className="text-sm font-bold"
                                  style={{ color: theme.emphasis.cost }}
                                >
                                  Cost: ${day.cost.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Tokens: {Formatter.tokens(day.tokens)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {heatmapLegendColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setSelectedMetric('tokens')}
              className={`rounded px-3 py-1 transition-colors ${selectedMetric === 'tokens' ? '' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
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
              className={`rounded px-3 py-1 transition-colors ${selectedMetric === 'cost' ? '' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
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
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tickFormatter={xAxisFormatter}
                  interval={timeRange === '7d' ? 0 : undefined}
                  tickMargin={12}
                  minTickGap={12}
                />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(value) =>
                    selectedMetric === 'cost'
                      ? formatCurrency(value)
                      : formatTokens(value * 1000000)
                  }
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151'
                  }}
                  labelFormatter={tooltipLabelFormatter}
                  formatter={tooltipFormatter}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric === 'cost' ? 'cost' : 'tokens'}
                  stroke={theme.chart.areaStroke}
                  fill={theme.chart.areaFill}
                  fillOpacity={0.3}
                  name={
                    selectedMetric === 'cost' ? 'Daily Cost' : 'Daily Tokens'
                  }
                />
                <Line
                  type="monotone"
                  dataKey={
                    selectedMetric === 'cost' ? 'costTrend' : 'tokensTrend'
                  }
                  stroke={theme.chart.trend}
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="6 4"
                  name="Trend"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  )
}
