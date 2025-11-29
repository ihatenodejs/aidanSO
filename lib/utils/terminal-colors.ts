/**
 * Terminal Color Utility
 *
 * Provides colored terminal output using Bun's native color API.
 * Automatically detects TTY support and respects NO_COLOR environment variable.
 *
 * @module lib/utils/terminal-colors
 * @example
 * ```typescript
 * import { terminalColors } from '@/lib/utils/terminal-colors'
 * import { logger } from '@/lib/utils/logger'
 *
 * console.log(terminalColors.success('Build complete!'))
 * logger.error('Failed to load configuration', 'config')
 * ```
 */

interface ProcessLike {
  env?: Record<string, string | undefined>
  stdout?: { isTTY?: boolean }
}

const getProcessLike = (): ProcessLike | undefined => {
  try {
    if (typeof globalThis === 'object' && globalThis !== null) {
      const maybeProcess = (globalThis as { process?: ProcessLike }).process
      if (maybeProcess && typeof maybeProcess === 'object') {
        return maybeProcess
      }
    }
  } catch {}
  return undefined
}

/**
 * Check if colors should be enabled
 */
const shouldUseColors = (): boolean => {
  const processLike = getProcessLike()

  // Respect NO_COLOR convention (https://no-color.org/)
  if (processLike?.env?.NO_COLOR !== undefined) {
    return false
  }

  const isTty = processLike?.stdout?.isTTY
  if (typeof isTty === 'boolean') {
    return isTty
  }

  return processLike !== undefined
}

const COLORS_ENABLED = shouldUseColors()

/**
 * ANSI reset code
 */
const RESET = '\x1b[0m'

/**
 * Color text for terminal output
 * Uses Bun.color() with automatic color depth detection
 */
const colorize = (text: string, colorHex: string): string => {
  if (!COLORS_ENABLED) {
    return text
  }

  try {
    const ansiCode = Bun.color(colorHex, 'ansi')
    return `${ansiCode}${text}${RESET}`
  } catch {
    return text
  }
}

/**
 * Semantic color functions for terminal output
 */
export const terminalColors = {
  /**
   * Red text
   */
  error: (text: string): string => colorize(text, '#ef4444'),

  /**
   * Yellow text
   */
  warn: (text: string): string => colorize(text, '#f59e0b'),

  /**
   * Green text
   */
  success: (text: string): string => colorize(text, '#10b981'),

  /**
   * Cyan text
   */
  info: (text: string): string => colorize(text, '#06b6d4'),

  /**
   * Blue text
   */
  debug: (text: string): string => colorize(text, '#3b82f6'),

  /**
   * Magenta text
   */
  accent: (text: string): string => colorize(text, '#a855f7'),

  /**
   * Dimmed
   */
  dim: (text: string): string => {
    if (!COLORS_ENABLED) return text
    return `\x1b[2m${text}\x1b[0m`
  },

  /**
   * Bright/bold
   */
  bright: (text: string): string => {
    if (!COLORS_ENABLED) return text
    return `\x1b[1m${text}\x1b[0m`
  },

  /**
   * Plaintext
   */
  plain: (text: string): string => text
}

/**
 * Check if colors are currently enabled
 */
export const areColorsEnabled = (): boolean => COLORS_ENABLED
