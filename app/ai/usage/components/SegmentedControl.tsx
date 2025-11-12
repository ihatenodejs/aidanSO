'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SegmentedOption<T extends string> {
  id: T
  label: string
  icon?: ReactNode
  disabled?: boolean
  accentColor?: string
}

/**
 * @public
 */
export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange?: (value: T) => void
  disabled?: boolean
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  className
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'flex flex-wrap justify-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/60 p-1.5',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.id === value
        const isDisabled = disabled || option.disabled
        const accent = option.accentColor ?? '#f9fafb'

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled && option.id !== value) onChange?.(option.id)
            }}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 sm:px-4 sm:text-sm',
              'flex-grow basis-[calc(50%-0.375rem)] sm:flex-grow-0 sm:basis-auto',
              isSelected && 'bg-gray-800 text-gray-100',
              !isSelected &&
                !isDisabled &&
                'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200',
              isDisabled && 'cursor-not-allowed text-gray-600 opacity-50'
            )}
            style={
              isSelected
                ? { boxShadow: `0 0 0 1px ${accent}`, color: accent }
                : undefined
            }
          >
            {option.icon && (
              <span
                aria-hidden="true"
                className="flex items-center"
                style={{
                  color: isSelected
                    ? accent
                    : isDisabled
                      ? '#4b5563'
                      : '#9ca3af'
                }}
              >
                {option.icon}
              </span>
            )}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
