'use client'

import { DailyData } from '@/lib/types/ai'
import { cn } from '@/lib/utils'

type TrendType = 'cost' | 'tokens' | 'days' | 'average'

interface UsageTrendGraphProps {
  daily: DailyData[]
  type: TrendType
  className?: string
}

export default function UsageTrendGraph({
  daily,
  type,
  className
}: UsageTrendGraphProps) {
  const trendData = daily.map((day, index) => {
    const previousDays = daily.slice(0, index + 1)

    switch (type) {
      case 'cost': {
        const cumulativeCost = previousDays.reduce(
          (sum, d) => sum + d.totalCost,
          0
        )
        return {
          date: day.date,
          value: cumulativeCost
        }
      }
      case 'tokens': {
        const cumulativeTokens = previousDays.reduce(
          (sum, d) => sum + d.totalTokens,
          0
        )
        return {
          date: day.date,
          value: cumulativeTokens / 1000000
        }
      }
      case 'days': {
        const activeDaysCount = previousDays.filter(
          (d) => d.totalTokens > 0 || d.totalCost > 0
        ).length
        return {
          date: day.date,
          value: activeDaysCount
        }
      }
      case 'average': {
        const totalCost = previousDays.reduce((sum, d) => sum + d.totalCost, 0)
        const averageCost = totalCost / Math.max(previousDays.length, 1)
        return {
          date: day.date,
          value: averageCost
        }
      }
      default:
        return { date: day.date, value: 0 }
    }
  })

  const getStrokeColor = () => {
    switch (type) {
      case 'cost':
        return '#3b82f6'
      case 'tokens':
        return '#10b981'
      case 'days':
        return '#f59e0b'
      case 'average':
        return '#8b5cf6'
      default:
        return '#6b7280'
    }
  }

  const createPath = () => {
    if (trendData.length === 0) return ''

    const width = 100
    const height = 100
    const paddingX = 0
    const paddingY = 0

    const values = trendData.map((d) => d.value)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const range = maxValue - minValue

    const getY = (value: number) => {
      if (range === 0) {
        return height / 2
      }

      const normalizedValue = (value - minValue) / range
      return height - paddingY - normalizedValue * (height - paddingY * 2)
    }

    if (trendData.length === 1) {
      const y = getY(trendData[0].value)
      return `M ${paddingX},${y} L ${width - paddingX},${y}`
    }

    const stepX =
      trendData.length > 1 ? (width - paddingX * 2) / (trendData.length - 1) : 0

    const points = trendData.map((point, index) => {
      const x = paddingX + stepX * index
      const y = getY(point.value)
      return `${x},${y}`
    })

    return `M ${points.join(' L ')}`
  }

  const strokeColor = getStrokeColor()

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {[0.2, 0.4, 0.6, 0.8].map((fraction) => (
          <line
            key={fraction}
            x1="0"
            y1={fraction * 100}
            x2="100"
            y2={fraction * 100}
            stroke="#374151"
            strokeOpacity={0.08}
            strokeDasharray="1.5 1.5"
          />
        ))}

        {/* Trend line */}
        <path
          d={createPath()}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity={0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
