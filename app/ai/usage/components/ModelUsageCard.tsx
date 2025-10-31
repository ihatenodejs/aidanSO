'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { DailyData } from '@/lib/types'
import { buildModelUsageData, formatCurrency } from './utils'
import type { ToolTheme } from '@/app/ai/theme'

interface ModelUsageCardProps {
  daily: DailyData[]
  totalCost: number
  theme: ToolTheme
}

export default function ModelUsageCard({
  daily,
  totalCost,
  theme
}: ModelUsageCardProps) {
  const modelUsageData = buildModelUsageData(daily)
  const palette = theme.chart.pie
  return (
    <section className="col-span-2 rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:col-span-1 lg:p-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
        Model Usage Distribution
      </h2>
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
              >
                {modelUsageData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={palette[index % palette.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number, _name, props) => {
                  const percentage = props?.payload?.percentage ?? 0
                  return [
                    `${formatCurrency(Number(value))} · ${percentage.toFixed(1)}%`,
                    'Cost'
                  ]
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center space-y-3">
          {modelUsageData.map((model, index) => {
            const percentage = (
              (model.value / Math.max(totalCost, 1)) *
              100
            ).toFixed(1)
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
                  <span className="text-sm text-gray-400">{percentage}%</span>
                  <span className="font-semibold text-gray-200">
                    ${model.value.toFixed(2)}
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
