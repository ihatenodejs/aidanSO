'use client'

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type {
  Payload,
  ValueType,
  NameType
} from 'recharts/types/component/DefaultTooltipContent'
import type { CCData } from '@/lib/types'
import { buildTokenTypeData } from './utils'
import type { ToolTheme } from '@/app/ai/theme'
import { Formatter } from '@/lib/utils/formatting'

type TokenTooltipProps = TooltipProps<ValueType, NameType> & {
  payload?: readonly Payload<ValueType, NameType>[]
}

/**
 * @public
 */
export interface TokenTypeProps {
  totals: CCData['totals']
  theme: ToolTheme
}

export default function TokenType({ totals, theme }: TokenTypeProps) {
  const tokenTypeData = buildTokenTypeData(totals)
  const renderTooltip = ({ active, payload }: TokenTooltipProps) => {
    if (!active || !payload?.length) return null

    const [firstEntry] = payload
    const dataPoint = (firstEntry?.payload ?? null) as
      | (typeof tokenTypeData)[number]
      | null
    const rawValue = Number(firstEntry?.value ?? 0)
    const formattedValue = `${Formatter.tokens(rawValue)} tokens`
    const percentage = dataPoint?.percentage ?? 0

    return (
      <div
        className="rounded-md border border-gray-700 bg-gray-900/95 px-3 py-2 text-sm text-gray-100 shadow-lg backdrop-blur-sm"
        style={{
          animation: 'tooltipFadeIn 200ms ease-out'
        }}
      >
        <p className="font-medium">
          {dataPoint?.name ?? firstEntry?.name ?? 'Token Type'}
        </p>
        <p className="text-xs text-gray-400">
          {percentage.toFixed(1)}% · {formattedValue}
        </p>
      </div>
    )
  }

  return (
    <section className="col-span-2 rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:col-span-1 lg:p-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
        Token Type
      </h2>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tokenTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis
              stroke="#9ca3af"
              tickFormatter={(value) => Formatter.tokens(value)}
              domain={[0, 'auto']}
            />
            <Tooltip
              content={renderTooltip}
              cursor={{ fill: 'rgba(31, 41, 55, 0.3)' }}
            />
            <Bar dataKey="value" fill={theme.chart.barSecondary} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-700 pt-4">
        {tokenTypeData.map((token) => (
          <div
            key={token.name}
            className="flex flex-col rounded-md border border-gray-700 bg-gray-800/30 p-3"
          >
            <span className="text-xs text-gray-400">{token.name}</span>
            <span className="mt-1 text-lg font-semibold text-gray-200">
              {Formatter.tokens(token.value)}
            </span>
            <span className="mt-0.5 text-xs text-gray-500">
              {(token.percentage ?? 0).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
