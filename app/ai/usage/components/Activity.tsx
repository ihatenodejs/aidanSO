"use client"

import { useCallback, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { DailyData, TimeRangeKey } from '@/lib/types'
import {
  buildDailyTrendData,
  formatCurrency,
  formatTokens,
  getHeatmapColor,
  prepareHeatmapData,
  formatAxisLabel,
  formatTooltipDate,
} from './utils'
import type { ToolTheme } from '@/app/ai/theme'

interface ActivityProps {
  daily: DailyData[]
  theme: ToolTheme
  timeRange: TimeRangeKey
}

export default function Activity({ daily, theme, timeRange }: ActivityProps) {
  const [viewMode, setViewMode] = useState<'heatmap' | 'chart'>('chart')
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'tokens'>('cost')

  const dailyTrendData = useMemo(() => buildDailyTrendData(daily), [daily])
  const heatmapWeeks = useMemo(() => prepareHeatmapData(daily), [daily])
  const maxCost = useMemo(
    () => (daily.length ? Math.max(...daily.map(d => d.totalCost)) : 0),
    [daily]
  )

  const toggleStyles = {
    '--ring-color': theme.focusRing,
    '--knob-color': theme.button.activeBackground,
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

      return [`${formatTokens(value)} tokens`, label]
    },
    [selectedMetric]
  )

  return (
    <section className="p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300 relative md:col-span-2 lg:col-span-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-200">Activity</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{viewMode === 'heatmap' ? 'Heatmap' : 'Chart'}</span>
          <button
            onClick={() => setViewMode(viewMode === 'heatmap' ? 'chart' : 'heatmap')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
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
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[900px]">
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 text-xs text-gray-400 w-10 pr-2">
                <div className="h-4"></div>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="h-4 flex items-center justify-end text-[10px]">
                    {day}
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="h-4 mb-1 text-xs text-gray-400">
                  {(() => {
                    const monthLabels: { month: string; position: number }[] = []
                    let lastMonth = -1
                    heatmapWeeks.forEach((week, weekIndex) => {
                      const firstDay = week.find(d => d !== null)
                      if (firstDay) {
                        const date = new Date(firstDay.date + 'T00:00:00Z')
                        const month = date.getUTCMonth()
                        if (month !== lastMonth) {
                          monthLabels.push({
                            month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
                            position: weekIndex * 20
                          })
                          lastMonth = month
                        }
                      }
                    })
                    return (
                      <div className="flex relative">
                        {monthLabels.map((label, idx) => (
                          <div key={idx} style={{ position: 'absolute', left: label.position }} className="w-10">
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
                        <div key={dayIndex} className="relative group">
                          <div
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: getHeatmapColor(maxCost, day?.value || 0, theme.heatmap) }}
                          />
                          {day && (
                            <div className="absolute z-10 invisible group-hover:visible -top-2 left-6">
                              <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-lg whitespace-nowrap">
                                <p className="text-gray-300 text-xs font-medium mb-1">{day.formattedDate}</p>
                                <p className="font-bold text-sm" style={{ color: theme.emphasis.cost }}>
                                  Cost: ${day.cost.toFixed(2)}
                                </p>
                                <p className="text-gray-400 text-xs">Tokens: {(day.tokens / 1000000).toFixed(2)}M</p>
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
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {heatmapLegendColors.map((color, idx) => (
                  <div key={idx} className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedMetric('cost')}
              className={`px-3 py-1 rounded transition-colors ${selectedMetric === 'cost' ? '' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              style={selectedMetric === 'cost'
                ? { backgroundColor: theme.button.activeBackground, color: theme.button.activeText }
                : undefined
              }
            >
              Cost
            </button>
            <button
              onClick={() => setSelectedMetric('tokens')}
              className={`px-3 py-1 rounded transition-colors ${selectedMetric === 'tokens' ? '' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              style={selectedMetric === 'tokens'
                ? { backgroundColor: theme.button.activeBackground, color: theme.button.activeText }
                : undefined
              }
            >
              Tokens
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
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
                tickFormatter={selectedMetric === 'cost' ? formatCurrency : formatTokens}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelFormatter={tooltipLabelFormatter}
                formatter={tooltipFormatter}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric === 'cost' ? 'cost' : 'tokens'}
                stroke={theme.chart.areaStroke}
                fill={theme.chart.areaFill}
                fillOpacity={0.3}
                name={selectedMetric === 'cost' ? 'Daily Cost' : 'Daily Tokens'}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric === 'cost' ? 'costTrend' : 'tokensTrend'}
                stroke={theme.chart.trend}
                strokeWidth={2}
                dot={false}
                strokeDasharray="6 4"
                name="Trend"
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </section>
  )
}
