/**
 * Logging Utility
 *
 * Provides filtered, formatted, and colored console logging based on
 * the WARNING_LEVEL environment variable.
 *
 * @module lib/utils/logger
 * @example
 * ```typescript
 * import { logger } from '@/lib/utils/logger'
 *
 * logger.debug('Cache hit')               // Shown when WARNING_LEVEL=debug
 * logger.info('Server starting...')       // Shown when WARNING_LEVEL=debug or info
 * logger.warning('Port already in use')   // Shown when WARNING_LEVEL=debug, info, or warning
 * logger.error('Failed to connect')       // Always shown
 * ```
 */

import { terminalColors } from './terminal-colors'

/**
 * Log severity levels in order of severity (least to most severe)
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Numeric severity for comparison
 */
const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARNING]: 2,
  [LogLevel.ERROR]: 3
}

/**
 * Get the configured minimum log level from environment
 * Defaults to 'info' if not set or invalid
 */
function getConfiguredLogLevel(): LogLevel {
  const envLevel = process.env.WARNING_LEVEL?.toLowerCase()

  switch (envLevel) {
    case 'debug':
      return LogLevel.DEBUG
    case 'info':
      return LogLevel.INFO
    case 'warning':
      return LogLevel.WARNING
    case 'error':
      return LogLevel.ERROR
    default:
      return LogLevel.INFO
  }
}

const CONFIGURED_LEVEL = getConfiguredLogLevel()

/**
 * Check if a message at the given level should be logged
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_SEVERITY[level] >= LOG_LEVEL_SEVERITY[CONFIGURED_LEVEL]
}

/**
 * Format a log message with timestamp and level prefix
 */
function formatMessage(
  level: LogLevel,
  message: string,
  prefix?: string
): string {
  const timestamp = new Date().toISOString()
  const prefixPart = prefix ? `[${prefix}]` : ''
  const levelPart = `[${level.toUpperCase()}]`

  return `${timestamp} ${levelPart}${prefixPart} ${message}`
}

/**
 * Standardized logger with environment-based filtering
 */
export const logger = {
  /**
   * Log an informational message (least severe)
   * Shown when WARNING_LEVEL is 'info' (default)
   *
   * @param message - The message to log
   * @param prefix - Optional prefix for the message (e.g., module name)
   */
  info(message: string, prefix?: string, details?: unknown): void {
    if (shouldLog(LogLevel.INFO)) {
      const formatted = formatMessage(LogLevel.INFO, message, prefix)
      if (details !== undefined) {
        console.log(terminalColors.info(formatted), details)
      } else {
        console.log(terminalColors.info(formatted))
      }
    }
  },

  /**
   * Log a warning message (medium severity)
   * Shown when WARNING_LEVEL is 'info' or 'warning'
   *
   * @param message - The message to log
   * @param prefix - Optional prefix for the message (e.g., module name)
   */
  warning(message: string, prefix?: string, details?: unknown): void {
    if (shouldLog(LogLevel.WARNING)) {
      const formatted = formatMessage(LogLevel.WARNING, message, prefix)
      if (details !== undefined) {
        console.warn(terminalColors.warn(formatted), details)
      } else {
        console.warn(terminalColors.warn(formatted))
      }
    }
  },

  /**
   * Alias for warning (common spelling variation)
   */
  warn(message: string, prefix?: string, details?: unknown): void {
    this.warning(message, prefix, details)
  },

  /**
   * Log an error message (most severe)
   * Always shown regardless of WARNING_LEVEL
   *
   * @param message - The message to log
   * @param prefix - Optional prefix for the message (e.g., module name)
   * @param error - Optional error object to log after the message
   */
  error(message: string, prefix?: string, error?: unknown): void {
    if (shouldLog(LogLevel.ERROR)) {
      const formatted = formatMessage(LogLevel.ERROR, message, prefix)
      if (error) {
        console.error(terminalColors.error(formatted), error)
      } else {
        console.error(terminalColors.error(formatted))
      }
    }
  },

  /**
   * Log a success message (treated as info level)
   * Uses green color for positive feedback
   *
   * @param message - The message to log
   * @param prefix - Optional prefix for the message (e.g., module name)
   */
  success(message: string, prefix?: string, details?: unknown): void {
    if (shouldLog(LogLevel.INFO)) {
      const timestamp = new Date().toISOString()
      const prefixPart = prefix ? `[${prefix}]` : ''
      const formatted = `${timestamp} [SUCCESS]${prefixPart} ${message}`
      if (details !== undefined) {
        console.log(terminalColors.success(formatted), details)
      } else {
        console.log(terminalColors.success(formatted))
      }
    }
  },

  /**
   * Log a debug message (lowest severity level)
   * Useful for verbose logging that's less important
   *
   * Only shown when WARNING_LEVEL is 'debug'. When WARNING_LEVEL is 'info',
   * 'warning', or 'error', debug messages are suppressed.
   *
   * The output is dimmed/grayed to visually distinguish it from more important
   * info messages.
   *
   * @param message - The message to log
   * @param prefix - Optional prefix for the message (e.g., module name)
   * @param details - Optional additional data to log after the message
   *
   * @example
   * ```typescript
   * logger.debug('Cache hit for key: user-123', 'cache')
   * logger.debug('Transforming device data', 'build-device-data')
   * logger.debug(`Client disconnected: ${socket.id}`, 'WebSocket')
   * ```
   */
  debug(message: string, prefix?: string, details?: unknown): void {
    if (shouldLog(LogLevel.DEBUG)) {
      const timestamp = new Date().toISOString()
      const prefixPart = prefix ? `[${prefix}]` : ''
      const formatted = `${timestamp} [DEBUG]${prefixPart} ${message}`
      if (details !== undefined) {
        console.log(terminalColors.dim(formatted), details)
      } else {
        console.log(terminalColors.dim(formatted))
      }
    }
  },

  /**
   * Get the currently configured log level
   */
  getLevel(): LogLevel {
    return CONFIGURED_LEVEL
  },

  /**
   * Check if a specific log level is enabled
   */
  isLevelEnabled(level: LogLevel): boolean {
    return shouldLog(level)
  },

  /**
   * Check if full error details (stack traces) should be shown
   * Returns true when WARNING_LEVEL is set to 'debug'
   *
   * Use this in error handling to conditionally include full error objects:
   * @example
   * ```typescript
   * try {
   *   await operation()
   * } catch (error) {
   *   const details = logger.shouldShowErrorDetails() ? error : undefined
   *   logger.error('Operation failed', 'module', details)
   * }
   * ```
   */
  shouldShowErrorDetails(): boolean {
    return CONFIGURED_LEVEL === LogLevel.DEBUG
  },

  /**
   * Output a raw message without formatting (for machine-readable logs)
   */
  raw(message: string): void {
    console.log(message)
  }
}

/**
 * Export types for external use
 */
export type { LogLevel as LogLevelType }
