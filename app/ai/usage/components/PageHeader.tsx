'use client'

import Link from 'next/link'
import { SiClaude, SiOpenai } from 'react-icons/si'
import { toolThemes, type ToolTheme, type ProviderId } from '@/app/ai/theme'

interface PageHeaderProps {
  selectedProvider?: ProviderId
  theme: ToolTheme
}

export default function PageHeader({
  selectedProvider = 'all',
  theme
}: PageHeaderProps) {
  const iconSize = 48

  const renderIcons = (): React.JSX.Element => {
    if (selectedProvider === 'claudeCode') {
      return <SiClaude size={iconSize} style={{ color: theme.accent }} />
    } else if (selectedProvider === 'codex') {
      return (
        <SiOpenai
          size={iconSize}
          style={{ color: theme.accent }}
          className="drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
        />
      )
    } else {
      return (
        <div className="flex justify-center gap-3 sm:gap-4">
          <SiClaude
            size={iconSize}
            style={{ color: toolThemes.claudeCode.accent }}
          />
          <SiOpenai
            size={iconSize}
            style={{ color: toolThemes.codex.accent }}
            className="drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
          />
        </div>
      )
    }
  }

  const getTitle = (): string => {
    if (selectedProvider === 'claudeCode') return 'Claude Code Usage'
    if (selectedProvider === 'codex') return 'Codex Usage'
    return 'AI Usage'
  }

  const getSubtitle = (): string => {
    if (selectedProvider === 'claudeCode') return 'Track my Claude Code usage'
    if (selectedProvider === 'codex') return 'Track my Codex usage'
    return 'Track my AI usage across providers'
  }

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
            {renderIcons()}
          </div>
          <h1 className="glow mb-2 text-2xl font-bold text-gray-100 sm:text-3xl lg:text-4xl">
            {getTitle()}
          </h1>
          <p className="text-sm text-gray-400 sm:text-base">{getSubtitle()}</p>
          <div
            className="mx-auto mt-4 h-1 w-12 rounded-full sm:mt-6 sm:w-16"
            style={{ backgroundColor: theme.accent }}
          />
        </div>
      </div>
    </div>
  )
}
