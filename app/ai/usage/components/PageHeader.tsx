'use client'

import Link from 'next/link'
import { SiClaude, SiOpenai } from 'react-icons/si'
import { toolThemes, type ToolTheme, type ProviderId } from '@/app/ai/theme'

interface PageHeaderProps {
  selectedProvider?: ProviderId
  theme: ToolTheme
}

export default function PageHeader({ selectedProvider = 'all', theme }: PageHeaderProps) {
  const iconSize = 60

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
        <div className="flex gap-4 justify-center">
          <SiClaude size={iconSize} style={{ color: toolThemes.claudeCode.accent }} />
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
      <div className="container mx-auto px-4 relative">
        <Link
          href="/ai"
          className="absolute top-5 left-2 text-gray-400 hover:text-gray-200 hover:underline transition-colors duration-200 px-2 py-1 text-sm sm:text-base z-10"
        >
          ← Back to AI
        </Link>
        <div className="py-12 text-center">
          <div className="flex justify-center mb-6">
            {renderIcons()}
          </div>
          <h1 className="text-4xl font-bold mb-2 text-gray-100 glow">{getTitle()}</h1>
          <p className="text-gray-400">{getSubtitle()}</p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full" style={{ backgroundColor: theme.accent }} />
        </div>
      </div>
    </div>
  )
}
