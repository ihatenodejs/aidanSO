"use client"

import PageHeader from './PageHeader'
import ProviderFilter from './ProviderFilter'
import TimeRangeFilter from './TimeRangeFilter'
import type { ToolTheme, ProviderId } from '@/app/ai/theme'
import type { TimeRangeKey } from '@/lib/types'

interface LoadingSkeletonProps {
  theme: ToolTheme
  selectedProvider?: ProviderId
  timeRange?: TimeRangeKey
}

const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized.padEnd(6, '0')

  const num = parseInt(value, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const buildSkeletonStyles = (theme: ToolTheme) => {
  const accentBase = theme.id === 'codex' ? theme.accentContrast : theme.accent
  const softAccent = hexToRgba(accentBase, 0.14)
  const mediumAccent = hexToRgba(accentBase, 0.22)
  const strongAccent = hexToRgba(accentBase, 0.35)

  return {
    cardBorder: hexToRgba(accentBase, 0.28),
    chipBorder: hexToRgba(accentBase, 0.4),
    solid: { backgroundColor: mediumAccent },
    gradient: {
      backgroundImage: `linear-gradient(90deg, ${softAccent}, ${strongAccent}, ${softAccent})`,
      backgroundColor: softAccent,
    },
    subtle: { backgroundColor: softAccent },
  }
}

export default function LoadingSkeleton({ theme, selectedProvider = 'all', timeRange = '1m' }: LoadingSkeletonProps) {
  const placeholderStyles = buildSkeletonStyles(theme)
  return (
    <main className="w-full relative">
      <PageHeader theme={theme} selectedProvider={selectedProvider} />

      <div className="mb-6 px-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div aria-hidden="true" />
          <div className="justify-self-center">
            <ProviderFilter
              selectedProvider={selectedProvider}
              onProviderChange={() => {}}
              hasClaudeCode
              hasCodex
              theme={theme}
              disabled
            />
          </div>
          <div className="justify-self-end">
            <TimeRangeFilter
              value={timeRange}
              onChange={() => {}}
              theme={theme}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4">
        <div
          className="p-6 border-2 rounded-lg transition-colors duration-300"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Cost</h3>
          <div className="h-9 w-32 rounded animate-pulse" style={placeholderStyles.gradient} />
        </div>
        <div
          className="p-6 border-2 rounded-lg transition-colors duration-300"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Tokens</h3>
          <div className="h-9 w-32 rounded animate-pulse" style={placeholderStyles.gradient} />
        </div>
        <div
          className="p-6 border-2 rounded-lg transition-colors duration-300"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Days Active</h3>
          <div className="flex items-center">
            <div className="h-9 w-16 rounded animate-pulse" style={placeholderStyles.gradient} />
            <div className="ml-3 h-5 w-12 rounded-full animate-pulse" style={placeholderStyles.subtle} />
          </div>
        </div>
        <div
          className="p-6 border-2 rounded-lg transition-colors duration-300"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Daily Cost</h3>
          <div className="h-9 w-32 rounded animate-pulse" style={placeholderStyles.gradient} />
        </div>
      </div>

      <div className="p-4 pb-0">
        <section
          className="p-8 border-2 rounded-lg transition-colors duration-300 relative md:col-span-2 lg:col-span-1"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-200">Activity</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Chart</span>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full"
                style={{ backgroundColor: hexToRgba(theme.focusRing, 0.25) }}
              >
                <span className="sr-only">Toggle view mode</span>
                <span
                  className="inline-block h-4 w-4 transform rounded-full translate-x-1 animate-pulse"
                  style={placeholderStyles.gradient}
                />
              </button>
            </div>
          </div>
          <div className="pb-6">
            <div className="flex gap-2 mb-4">
              <button
                className="px-3 py-1 rounded"
                style={{ backgroundColor: theme.button.activeBackground, color: theme.button.activeText }}
              >
                Cost
              </button>
              <button
                className="px-3 py-1 rounded border text-gray-300"
                style={{ borderColor: placeholderStyles.chipBorder, backgroundColor: hexToRgba(theme.focusRing, 0.12) }}
              >
                Tokens
              </button>
            </div>
            <div className="h-[400px] w-full rounded animate-pulse" style={placeholderStyles.gradient} />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <section
          className="p-8 border-2 rounded-lg transition-colors duration-300 col-span-2 lg:col-span-1"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-200">Model Usage Distribution</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="h-[300px] rounded animate-pulse" style={placeholderStyles.gradient} />
            <div className="flex flex-col justify-center space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={placeholderStyles.gradient} />
                    <div className="h-4 w-20 rounded animate-pulse" style={placeholderStyles.gradient} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-10 rounded animate-pulse" style={placeholderStyles.subtle} />
                    <div className="h-4 w-16 rounded animate-pulse" style={placeholderStyles.gradient} />
                  </div>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Models Used</span>
                  <div className="h-5 w-8 rounded animate-pulse" style={placeholderStyles.gradient} />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400">Most Used</span>
                  <div className="h-4 w-20 rounded animate-pulse" style={placeholderStyles.subtle} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="p-8 border-2 rounded-lg transition-colors duration-300 col-span-2 lg:col-span-1"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-200">By Token Type</h2>
          <div className="h-[300px] rounded animate-pulse" style={placeholderStyles.gradient} />
        </section>
        <section
          className="p-8 border-2 rounded-lg transition-colors duration-300 sm:col-span-2"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-200">Token Composition</h2>
          <div className="h-[300px] rounded animate-pulse" style={placeholderStyles.gradient} />
        </section>
      </div>

      <div className="px-4 pb-4">
        <section
          className="p-8 border-2 rounded-lg transition-colors duration-300"
          style={{ borderColor: placeholderStyles.cardBorder }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-200">Recent Sessions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-4 text-gray-400">Date</th>
                  <th className="py-2 px-4 text-gray-400">Models Used</th>
                  <th className="py-2 px-4 text-gray-400">Total Tokens</th>
                  <th className="py-2 px-4 text-gray-400">Cost</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-2 px-4">
                      <div className="h-5 w-24 rounded animate-pulse" style={placeholderStyles.gradient} />
                    </td>
                    <td className="py-2 px-4">
                      <div className="h-5 w-96 rounded animate-pulse" style={placeholderStyles.gradient} />
                    </td>
                    <td className="py-2 px-4">
                      <div className="h-5 w-16 rounded animate-pulse" style={placeholderStyles.subtle} />
                    </td>
                    <td className="py-2 px-4">
                      <div className="h-5 w-20 rounded animate-pulse" style={placeholderStyles.gradient} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
