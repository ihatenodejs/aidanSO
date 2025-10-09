"use client"

import type { ToolTheme } from '@/app/ai/theme'
import type { TimeRangeKey } from '@/lib/types'
import { SegmentedControl, type SegmentedOption } from './SegmentedControl'

const TIME_RANGE_OPTIONS = [
  { id: '7d', label: '7d' },
  { id: '1m', label: '1mo' },
  { id: '3m', label: '3mo' },
  { id: '6m', label: '6mo' },
  { id: '1y', label: '1y' },
  { id: 'all', label: 'All' },
] as const satisfies ReadonlyArray<SegmentedOption<TimeRangeKey>>

type TimeRangeOptionId = (typeof TIME_RANGE_OPTIONS)[number]['id']

interface TimeRangeFilterProps {
  value: TimeRangeKey
  onChange: (value: TimeRangeKey) => void
  theme: ToolTheme
  disabled?: boolean
  className?: string
}

export default function TimeRangeFilter({
  value,
  onChange,
  theme,
  disabled = false,
  className,
}: TimeRangeFilterProps) {
  const options = TIME_RANGE_OPTIONS.map<SegmentedOption<TimeRangeOptionId>>(option => ({
    ...option,
    accentColor: theme.accent,
  }))

  return (
    <SegmentedControl
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
    />
  )
}
