/**
 * AI Provider Configuration
 *
 * @remarks
 * Defines metadata and utilities for all AI providers supported by agent-exporter.
 * Used throughout the application for consistent provider handling, display, and theming.
 *
 * @module lib/config/ai-providers
 * @category Configuration
 */

import { Claude, OpenAI, Qwen, Gemini } from '@lobehub/icons'
import type { AIProvider } from '@/lib/types'
import type { IconType } from 'react-icons'
import OpenCodeIcon from '@/components/icons/OpenCodeIcon'

/**
 * Provider metadata for UI display and theming.
 */
export interface ProviderConfig {
  /** Unique identifier matching AIProvider type */
  id: AIProvider
  /** Display name for UI */
  displayName: string
  /** Short description */
  description: string
  /** Icon component (react-icons IconType or custom React component) */
  icon?: IconType | React.ComponentType<{ className?: string }>
  /** Primary theme color (hex) */
  color: string
  /** Model name patterns for auto-detection */
  modelPatterns: RegExp[]
  /** Agent-exporter provider identifier */
  exporterKey: string
}

/**
 * Complete provider configuration map.
 */
export const PROVIDER_CONFIGS: Record<AIProvider, ProviderConfig> = {
  claudeCode: {
    id: 'claudeCode',
    displayName: 'Claude Code',
    description: 'Anthropic Claude models via Claude Code',
    icon: Claude,
    color: '#D97757',
    modelPatterns: [/^claude-/i, /^anthropic/i],
    exporterKey: 'ccusage'
  },
  codex: {
    id: 'codex',
    displayName: 'Codex',
    description: 'OpenAI models via Codex',
    icon: OpenAI,
    color: '#10A37F',
    modelPatterns: [/^gpt-/i, /^o1-/i, /^openai/i],
    exporterKey: 'codex'
  },
  opencode: {
    id: 'opencode',
    displayName: 'OpenCode',
    description: 'Open source AI coding assistant',
    icon: OpenCodeIcon,
    color: '#FFFFFF',
    modelPatterns: [/^opencode/i, /^oc-/i],
    exporterKey: 'opencode'
  },
  qwen: {
    id: 'qwen',
    displayName: 'Qwen',
    description: 'Alibaba Qwen models',
    icon: Qwen,
    color: '#665CEE',
    modelPatterns: [/^qwen/i, /^qw-/i],
    exporterKey: 'qwen'
  },
  gemini: {
    id: 'gemini',
    displayName: 'Gemini',
    description: 'Google Gemini models',
    icon: Gemini,
    color: '#8E75B2',
    modelPatterns: [/^gemini/i, /^gemma/i, /^google/i],
    exporterKey: 'gemini'
  }
}

/**
 * Array of all providers for iteration.
 */
export const ALL_PROVIDERS: AIProvider[] = [
  'claudeCode',
  'codex',
  'opencode',
  'qwen',
  'gemini'
]

/**
 * Detect provider from model name.
 *
 * @param modelName - Model identifier (e.g., 'claude-sonnet-4-20250514')
 * @returns Provider ID or null if not detected
 *
 * @example
 * ```ts
 * detectProvider('claude-sonnet-4-20250514') // 'claudeCode'
 * detectProvider('gpt-5-codex') // 'codex'
 * detectProvider('gemini-2.5-pro') // 'gemini'
 * ```
 */
export function detectProvider(modelName: string): AIProvider | null {
  for (const provider of ALL_PROVIDERS) {
    const config = PROVIDER_CONFIGS[provider]
    if (config.modelPatterns.some((pattern) => pattern.test(modelName))) {
      return provider
    }
  }
  return null
}

/**
 * Get provider configuration by ID.
 *
 * @param provider - Provider identifier
 * @returns Provider configuration
 */
export function getProviderConfig(provider: AIProvider): ProviderConfig {
  return PROVIDER_CONFIGS[provider]
}

/**
 * Get display name for provider.
 *
 * @param provider - Provider identifier
 * @returns Display name
 */
export function getProviderDisplayName(provider: AIProvider): string {
  return PROVIDER_CONFIGS[provider].displayName
}

/**
 * Get agent-exporter key for provider.
 *
 * @param provider - Provider identifier
 * @returns agent-exporter provider key
 */
export function getExporterKey(provider: AIProvider): string {
  return PROVIDER_CONFIGS[provider].exporterKey
}
