'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { colors } from '@/lib/theme/colors'
import { surfaces } from '@/lib/theme/surfaces'
import { cn } from '@/lib/utils'
import { Activity, Clock, Info, Loader2 } from 'lucide-react'
import type { ServiceStatusResult } from '@/lib/types'
import { STATUS_CHART_COLORS } from '@/lib/config/status'
import StatusInfoDialog from './StatusInfoDialog'

/**
 * @public
 */
export interface MetricsOverviewProps {
  services: ServiceStatusResult[]
  stats: {
    operational: number
    down: number
    total: number
  }
  avgResponseTime: number
  isChecking?: boolean
}

export default function MetricsOverview({
  services,
  stats,
  avgResponseTime,
  isChecking = false
}: MetricsOverviewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const chartData = services
    .filter((s) => s.responseTime !== null || s.serverResponseTime !== null)
    .map((s) => ({
      name: s.project.domain,
      browser: s.responseTime || 0,
      server: s.serverResponseTime || 0,
      status: s.status
    }))
    .sort((a, b) => {
      const totalA = (a.browser || 0) + (a.server || 0)
      const totalB = (b.browser || 0) + (b.server || 0)
      return totalA - totalB
    })
    .slice(0, 10)

  return (
    <>
      <div className="space-y-6 p-6 sm:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className={cn(surfaces.card.ai, 'p-3 sm:p-4')}>
            <h3 className="mb-1 text-xs font-medium text-gray-400 sm:mb-2 sm:text-sm">
              Online/Total
            </h3>
            <div className="flex items-center gap-2 sm:gap-3">
              <Activity className="shrink-0 text-gray-300" size={16} />
              <p className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-gray-100 sm:text-2xl md:text-3xl">
                  {stats.operational}
                </span>
                <span className="text-base font-medium text-gray-500 sm:text-lg md:text-xl">
                  /{stats.total}
                </span>
              </p>
            </div>
          </div>

          <div className={cn(surfaces.card.ai, 'p-3 sm:p-4')}>
            <h3 className="mb-1 text-xs font-medium text-gray-400 sm:mb-2 sm:text-sm">
              Avg Response
            </h3>
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="shrink-0 text-gray-300" size={16} />
              <p className="text-xl font-bold text-gray-100 sm:text-2xl md:text-3xl">
                {avgResponseTime}ms
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-200 sm:text-2xl">
                Response Times
              </h2>
              {isChecking && (
                <Loader2
                  size={18}
                  className="animate-spin text-gray-400"
                  aria-label="Updating measurements"
                />
              )}
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors',
                'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
                'focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none'
              )}
              aria-label="Learn more about response time measurements"
            >
              <Info size={14} />
              <span className="text-xs font-medium tracking-wide uppercase">
                Limitations
              </span>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={STATUS_CHART_COLORS.grid}
              />
              <XAxis
                dataKey="name"
                stroke={colors.text.muted}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke={colors.text.muted}
                label={{
                  value: 'ms',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: colors.text.muted }
                }}
              />
              <Tooltip
                cursor={{
                  fill: STATUS_CHART_COLORS.cursor,
                  fillOpacity: STATUS_CHART_COLORS.cursorOpacity
                }}
                contentStyle={{
                  backgroundColor: colors.backgrounds.cardSolid,
                  border: `1px solid ${colors.borders.default}`,
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => [
                  `${value}ms`,
                  name === 'browser' ? 'Browser' : 'Server'
                ]}
              />
              <Legend
                wrapperStyle={{ paddingTop: '8px' }}
                iconType="rect"
                formatter={(value: string) =>
                  value === 'browser' ? 'Browser' : 'Server'
                }
              />
              <Bar
                dataKey="browser"
                name="browser"
                fill={STATUS_CHART_COLORS.bar}
                fillOpacity={STATUS_CHART_COLORS.barOpacity}
                radius={[4, 4, 0, 0]}
                activeBar={{ fill: STATUS_CHART_COLORS.barHover }}
              />
              <Bar
                dataKey="server"
                name="server"
                fill={STATUS_CHART_COLORS.barServer}
                fillOpacity={STATUS_CHART_COLORS.barOpacity}
                radius={[4, 4, 0, 0]}
                activeBar={{ fill: STATUS_CHART_COLORS.barServerHover }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <StatusInfoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}
