'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { PROVIDER_CONFIGS } from '@/lib/config/ai-providers'
import { toolThemes, type ToolTheme, type ProviderId } from '@/app/ai/theme'

/**
 * @public
 */
export interface PageHeaderProps {
  selectedProvider?: ProviderId
  theme: ToolTheme
}

export default function PageHeader({
  selectedProvider = 'all',
  theme
}: PageHeaderProps) {
  const iconSize = 48

  const renderedIcons = useMemo(() => {
    if (selectedProvider !== 'all') {
      const config = PROVIDER_CONFIGS[selectedProvider]
      const Icon = config.icon

      if (!Icon) {
        return <div style={{ width: iconSize, height: iconSize }} />
      }

      return (
        <div style={{ color: theme.accent, fontSize: iconSize }}>
          <Icon className="drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]" />
        </div>
      )
    }

    return (
      <div className="flex justify-center gap-3 sm:gap-4">
        {(['claudeCode', 'codex', 'opencode', 'qwen', 'gemini'] as const).map(
          (providerId) => {
            const config = PROVIDER_CONFIGS[providerId]
            const Icon = config.icon
            const providerTheme = toolThemes[providerId]

            if (!Icon) return null

            return (
              <div
                key={providerId}
                style={{ color: providerTheme.accent, fontSize: iconSize }}
              >
                <Icon className="drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]" />
              </div>
            )
          }
        )}
      </div>
    )
  }, [selectedProvider, theme.accent])

  const title = useMemo(() => {
    if (selectedProvider === 'all') return 'AI Usage'
    return `${PROVIDER_CONFIGS[selectedProvider].displayName} Usage`
  }, [selectedProvider])
  const subtitle = useMemo(() => {
    if (selectedProvider === 'all') return 'Track my AI usage across providers'
    return `Track my ${PROVIDER_CONFIGS[selectedProvider].displayName} usage`
  }, [selectedProvider])

  const dividerStyle = useMemo(
    () => ({ backgroundColor: theme.accent }),
    [theme.accent]
  )

  return (
    <div className="relative">
      <div className="relative container mx-auto px-4">
        <Link
          href="/ai"
          className="absolute top-3 left-2 z-10 px-2 py-1 text-xs text-gray-400 transition-colors duration-200 hover:text-gray-200 hover:underline sm:top-5 sm:text-sm lg:text-base"
        >
          ← Back to AI
        </Link>
        <div className="py-8 text-center sm:py-12">
          <div className="mb-4 flex justify-center sm:mb-6">
            {renderedIcons}
          </div>
          <h1 className="glow mb-2 text-2xl font-bold text-gray-100 sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="text-sm text-gray-400 sm:text-base">{subtitle}</p>
          <div
            className="mx-auto mt-4 h-1 w-12 rounded-full sm:mt-6 sm:w-16"
            style={dividerStyle}
          />
        </div>
      </div>
    </div>
  )
}
