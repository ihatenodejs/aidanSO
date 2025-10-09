"use client"

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { Payload, ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import type { CCData } from '@/lib/types'
import { buildTokenTypeData } from './utils'
import type { ToolTheme } from '@/app/ai/theme'

type TokenTooltipProps = TooltipProps<ValueType, NameType> & {
  payload?: Payload<ValueType, NameType>[]
}

interface TokenTypeProps {
  totals: CCData['totals']
  theme: ToolTheme
}

export default function TokenType({ totals, theme }: TokenTypeProps) {
  const tokenTypeData = buildTokenTypeData(totals)
  const renderTooltip = ({ active, payload }: TokenTooltipProps) => {
    if (!active || !payload?.length) return null

    const [firstEntry] = payload
    const dataPoint = (firstEntry?.payload ?? null) as (typeof tokenTypeData)[number] | null
    const rawValue = Number(firstEntry?.value ?? 0)
    const formattedValue = `${(rawValue / 1_000_000).toFixed(2)}M tokens`
    const percentage = dataPoint?.percentage ?? 0

    return (
      <div className="rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100">
        <p className="font-medium">{dataPoint?.name ?? firstEntry?.name ?? 'Token Type'}</p>
        <p className="text-xs text-gray-400">{percentage.toFixed(1)}% · {formattedValue}</p>
      </div>
    )
  }

  return (
    <section className="p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300 col-span-2 lg:col-span-1">
      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Token Type</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={tokenTypeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} domain={[0, 'auto']} />
          <Tooltip content={renderTooltip} cursor={{ fill: 'rgba(31, 41, 55, 0.3)' }} />
          <Bar dataKey="value" fill={theme.chart.barSecondary} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
