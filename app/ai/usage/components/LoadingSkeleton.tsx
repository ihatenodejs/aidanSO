'use client'

import PageShell from '@/components/layout/PageShell'
import PageHeader from './PageHeader'
import ProviderFilter from './ProviderFilter'
import TimeRangeFilter from './TimeRangeFilter'
import type { ToolTheme, ProviderId } from '@/app/ai/theme'
import type { TimeRangeKey } from '@/lib/types'
import { surfaces } from '@/lib/theme'

interface LoadingSkeletonProps {
  theme: ToolTheme
  selectedProvider?: ProviderId
  timeRange?: TimeRangeKey
}

const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
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
      backgroundColor: softAccent
    },
    subtle: { backgroundColor: softAccent }
  }
}

export default function LoadingSkeleton({
  theme,
  selectedProvider = 'all',
  timeRange = '1m'
}: LoadingSkeletonProps) {
  const placeholderStyles = buildSkeletonStyles(theme)
  return (
    <PageShell variant="full-width">
      <PageHeader theme={theme} selectedProvider={selectedProvider} />

      <div className="mb-6 px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-4">
          <ProviderFilter
            selectedProvider={selectedProvider}
            onProviderChange={() => {}}
            hasClaudeCode
            hasCodex
            hasOpencode
            hasQwen
            hasGemini
            theme={theme}
            disabled
            className="w-full sm:w-auto"
          />
          <TimeRangeFilter
            value={timeRange}
            onChange={() => {}}
            theme={theme}
            disabled
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-4">
        <div className={surfaces.card.ai}>
          <h3 className="mb-2 text-sm font-medium text-gray-400">Total Cost</h3>
          <div
            className="h-9 w-24 animate-pulse rounded"
            style={placeholderStyles.gradient}
          />
        </div>
        <div className={surfaces.card.ai}>
          <h3 className="mb-2 text-sm font-medium text-gray-400">
            Total Tokens
          </h3>
          <div
            className="h-9 w-20 animate-pulse rounded"
            style={placeholderStyles.gradient}
          />
        </div>
        <div className={surfaces.card.ai}>
          <h3 className="mb-2 text-sm font-medium text-gray-400">
            Days Active
          </h3>
          <div className="flex items-center text-3xl">
            <div
              className="h-9 w-12 animate-pulse rounded"
              style={placeholderStyles.gradient}
            />
            <span className="ml-3 flex items-center gap-1.5 rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-gray-50">
              <div className="h-4 w-4 animate-pulse rounded-full bg-orange-500/30" />
              <div
                className="h-3 w-6 animate-pulse rounded"
                style={placeholderStyles.gradient}
              />
            </span>
          </div>
        </div>
        <div className={surfaces.card.ai}>
          <h3 className="mb-2 text-sm font-medium text-gray-400">
            Avg Daily Cost
          </h3>
          <div
            className="h-9 w-24 animate-pulse rounded"
            style={placeholderStyles.gradient}
          />
        </div>
      </div>

      <div className="px-4 pt-4">
        <section className="relative rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 md:col-span-2 lg:col-span-1 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-200 sm:text-2xl">
              Activity
            </h2>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-gray-400">Chart</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900">
                <span className="sr-only">Toggle view mode</span>
                <span
                  className="inline-block h-4 w-4 translate-x-1 transform animate-pulse rounded-full transition-transform"
                  style={{ backgroundColor: theme.button.activeBackground }}
                />
              </button>
            </div>
          </div>
          <div className="mb-4 flex gap-2">
            <button
              className="rounded px-3 py-1 transition-colors"
              style={{
                backgroundColor: theme.button.activeBackground,
                color: theme.button.activeText
              }}
            >
              Cost
            </button>
            <button className="rounded bg-gray-700 px-3 py-1 text-gray-300 transition-colors hover:bg-gray-600">
              Tokens
            </button>
          </div>
          <div className="h-[300px] sm:h-[400px]">
            <div
              className="h-full w-full animate-pulse rounded"
              style={placeholderStyles.gradient}
            />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 pt-4 lg:grid-cols-2">
        <section className="col-span-2 rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:col-span-1 lg:p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
            Model Usage Distribution
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-[250px] lg:h-[300px]">
              <div
                className="h-full w-full animate-pulse rounded"
                style={placeholderStyles.gradient}
              />
            </div>
            <div className="flex flex-col justify-center space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 animate-pulse rounded-full"
                      style={placeholderStyles.gradient}
                    />
                    <div
                      className="h-4 w-20 animate-pulse rounded"
                      style={placeholderStyles.gradient}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-10 animate-pulse rounded"
                      style={placeholderStyles.subtle}
                    />
                    <div
                      className="h-4 w-16 animate-pulse rounded"
                      style={placeholderStyles.gradient}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-3 border-t border-gray-700 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Models Used</span>
                  <div
                    className="h-5 w-8 animate-pulse rounded"
                    style={placeholderStyles.gradient}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-gray-400">Most Used</span>
                  <div
                    className="h-4 w-20 animate-pulse rounded"
                    style={placeholderStyles.subtle}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="col-span-2 rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:col-span-1 lg:p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
            Token Type
          </h2>
          <div className="h-[250px] sm:h-[300px]">
            <div
              className="h-full w-full animate-pulse rounded"
              style={placeholderStyles.gradient}
            />
          </div>
        </section>
      </div>

      <div className="px-4 pt-4">
        <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:col-span-2 lg:p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
            Model Usage Over Time
          </h2>
          <div className="h-[300px] sm:h-[350px] lg:h-[320px]">
            <div
              className="h-full w-full animate-pulse rounded"
              style={placeholderStyles.gradient}
            />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2">
        <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
            Token Composition
          </h2>
          <div className="h-[250px] sm:h-[300px]">
            <div
              className="h-full w-full animate-pulse rounded"
              style={placeholderStyles.gradient}
            />
          </div>
        </section>
        <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-6 lg:p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-200 sm:text-2xl">
            Recent Sessions
          </h2>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2 text-gray-400">Date</th>
                  <th className="px-4 py-2 text-gray-400">Models Used</th>
                  <th className="px-4 py-2 text-gray-400">Total Tokens</th>
                  <th className="px-4 py-2 text-gray-400">Cost</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-2">
                      <div
                        className="h-5 w-24 animate-pulse rounded"
                        style={placeholderStyles.gradient}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div
                        className="h-5 w-48 animate-pulse rounded"
                        style={placeholderStyles.gradient}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div
                        className="h-5 w-16 animate-pulse rounded"
                        style={placeholderStyles.subtle}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div
                        className="h-5 w-20 animate-pulse rounded"
                        style={placeholderStyles.gradient}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 sm:hidden">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="space-y-2 rounded-lg border border-gray-700 p-4"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="h-4 w-20 animate-pulse rounded"
                    style={placeholderStyles.gradient}
                  />
                  <div
                    className="h-5 w-16 animate-pulse rounded"
                    style={placeholderStyles.gradient}
                  />
                </div>
                <div
                  className="h-3 w-32 animate-pulse rounded"
                  style={placeholderStyles.subtle}
                />
                <div
                  className="h-4 w-24 animate-pulse rounded"
                  style={placeholderStyles.gradient}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
