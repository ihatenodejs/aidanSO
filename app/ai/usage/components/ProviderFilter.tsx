'use client'

import { Claude, OpenAI, Qwen, Gemini } from '@lobehub/icons'
import { toolThemes, type ToolTheme, type ProviderId } from '@/app/ai/theme'
import { SegmentedControl, type SegmentedOption } from './SegmentedControl'
import OpenCodeIcon from '@/components/icons/OpenCodeIcon'

interface ProviderFilterProps {
  selectedProvider: ProviderId
  onProviderChange: (provider: ProviderId) => void
  hasClaudeCode: boolean
  hasCodex: boolean
  hasOpencode: boolean
  hasQwen: boolean
  hasGemini: boolean
  theme: ToolTheme
  disabled?: boolean
  loading?: boolean
  className?: string
}

export default function ProviderFilter({
  selectedProvider,
  onProviderChange,
  hasClaudeCode,
  hasCodex,
  hasOpencode,
  hasQwen,
  hasGemini,
  theme,
  disabled = false,
  loading = false,
  className
}: ProviderFilterProps) {
  const hasAnyProvider =
    hasClaudeCode || hasCodex || hasOpencode || hasQwen || hasGemini

  const providers: Array<SegmentedOption<ProviderId> & { available: boolean }> =
    [
      {
        id: 'all',
        label: 'All Tools',
        icon: null,
        available: hasAnyProvider,
        accentColor: toolThemes.all.accent
      },
      {
        id: 'claudeCode',
        label: 'Claude Code',
        icon: <Claude />,
        available: hasClaudeCode,
        accentColor: toolThemes.claudeCode.accent
      },
      {
        id: 'codex',
        label: 'Codex',
        icon: <OpenAI />,
        available: hasCodex,
        accentColor: toolThemes.codex.accent
      },
      {
        id: 'opencode',
        label: 'OpenCode',
        icon: <OpenCodeIcon />,
        available: hasOpencode,
        accentColor: toolThemes.opencode.accent
      },
      {
        id: 'qwen',
        label: 'Qwen',
        icon: <Qwen />,
        available: hasQwen,
        accentColor: toolThemes.qwen.accent
      },
      {
        id: 'gemini',
        label: 'Gemini',
        icon: <Gemini />,
        available: hasGemini,
        accentColor: toolThemes.gemini.accent
      }
    ]

  const segmentedOptions: SegmentedOption<ProviderId>[] = providers.map(
    (provider) => ({
      id: provider.id,
      label: provider.label,
      icon: provider.icon,
      accentColor: provider.accentColor ?? theme.accent,
      disabled: !provider.available
    })
  )

  return (
    <SegmentedControl
      options={segmentedOptions}
      value={selectedProvider}
      onChange={onProviderChange}
      disabled={disabled || loading}
      className={className}
    />
  )
}
