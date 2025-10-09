"use client"

import { SiClaude, SiOpenai } from 'react-icons/si'
import { toolThemes, type ToolTheme } from '@/app/ai/theme'
import { SegmentedControl, type SegmentedOption } from './SegmentedControl'

type ProviderOptionId = 'all' | 'claudeCode' | 'codex'

interface ProviderFilterProps {
  selectedProvider: ProviderOptionId
  onProviderChange: (provider: ProviderOptionId) => void
  hasClaudeCode: boolean
  hasCodex: boolean
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
  theme,
  disabled = false,
  loading = false,
  className,
}: ProviderFilterProps) {
  const providers: Array<SegmentedOption<ProviderOptionId> & { available: boolean }> = [
    {
      id: 'all',
      label: 'All Tools',
      icon: null,
      available: hasClaudeCode || hasCodex,
      accentColor: toolThemes.all.accent,
    },
    {
      id: 'claudeCode',
      label: 'Claude Code',
      icon: <SiClaude />,
      available: hasClaudeCode,
      accentColor: toolThemes.claudeCode.accent,
    },
    {
      id: 'codex',
      label: 'Codex',
      icon: <SiOpenai />,
      available: hasCodex,
      accentColor: toolThemes.codex.accent,
    }
  ]

  const segmentedOptions: SegmentedOption<ProviderOptionId>[] = providers.map(provider => ({
    id: provider.id,
    label: provider.label,
    icon: provider.icon,
    accentColor: provider.accentColor ?? theme.accent,
    disabled: !provider.available,
  }))

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
