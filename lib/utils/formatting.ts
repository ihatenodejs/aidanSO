/**
 * Formatter utility class providing consistent formatting functions for various data types.
 *
 * @remarks
 * This class contains static methods for formatting numbers, dates, strings, and other common
 * data types across the application. All methods are pure functions with no side effects.
 *
 * @example
 * ```ts
 * import { Formatter } from '@/lib/utils'
 *
 * // Format currency
 * const price = Formatter.currency(1234.56) // "$1234.56"
 *
 * // Format large numbers
 * const tokens = Formatter.tokens(1500000) // "1.5M"
 *
 * // Format dates
 * const date = Formatter.date(new Date(), 'long') // "January 15, 2025"
 * ```
 *
 * @category Utils
 * @public
 */
export class Formatter {
  /**
   * Formats a number as currency with a dollar sign and fixed decimal places.
   *
   * @param value - The numeric value to format as currency
   * @param decimals - Number of decimal places to display (default: 2)
   * @returns Formatted currency string with dollar sign
   *
   * @example
   * ```ts
   * Formatter.currency(1234.567, 2) // "$1234.57"
   * Formatter.currency(99.9)        // "$99.90"
   * Formatter.currency(1000, 0)     // "$1000"
   * ```
   *
   * @public
   */
  static currency(value: number, decimals: number = 2): string {
    return `$${value.toFixed(decimals)}`
  }

  /**
   * Formats large numbers with metric suffixes (K, M, B) for readability.
   *
   * @param value - The numeric value to format
   * @returns Formatted string with appropriate suffix
   *
   * @remarks
   * - Values >= 1 billion use 'B' suffix
   * - Values >= 1 million use 'M' suffix
   * - Values >= 1 thousand use 'K' suffix
   * - Smaller values return as integers
   *
   * @example
   * ```ts
   * Formatter.tokens(2_500_000_000) // "2.5B"
   * Formatter.tokens(1_500_000)     // "1.5M"
   * Formatter.tokens(7_500)         // "7.5K"
   * Formatter.tokens(999)           // "999"
   * ```
   *
   * @public
   */
  static tokens(value: number): string {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`
    }
    return value.toFixed(0)
  }

  /**
   * Formats a number as a percentage with a percent sign.
   *
   * @param value - The numeric value to format as percentage (e.g., 85.5 for 85.5%)
   * @param decimals - Number of decimal places to display (default: 1)
   * @returns Formatted percentage string with percent sign
   *
   * @example
   * ```ts
   * Formatter.percentage(85.5)      // "85.5%"
   * Formatter.percentage(100, 0)    // "100%"
   * Formatter.percentage(33.333, 2) // "33.33%"
   * ```
   *
   * @public
   */
  static percentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`
  }

  /**
   * Formats a date object or ISO string into various human-readable formats.
   *
   * @param date - Date object or ISO date string to format
   * @param format - Output format style (default: 'short')
   * @returns Formatted date string in the specified format
   *
   * @remarks
   * Supported formats:
   * - 'iso': ISO 8601 format (e.g., "2025-01-15T10:30:00.000Z")
   * - 'long': Full month name (e.g., "January 15, 2025")
   * - 'short': Abbreviated month (e.g., "Jan 15, 2025")
   *
   * @example
   * ```ts
   * const date = new Date('2025-01-15')
   * Formatter.date(date, 'short') // "Jan 15, 2025"
   * Formatter.date(date, 'long')  // "January 15, 2025"
   * Formatter.date(date, 'iso')   // "2025-01-15T00:00:00.000Z"
   *
   * // Also accepts ISO strings
   * Formatter.date('2025-01-15', 'short') // "Jan 15, 2025"
   * ```
   *
   * @public
   */
  static date(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date

    switch (format) {
      case 'iso':
        return d.toISOString()
      case 'long':
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      case 'short':
      default:
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
    }
  }

  /**
   * Formats a duration in days into a compact human-readable string.
   *
   * @param days - Number of days to format
   * @returns Compact duration string with appropriate unit
   *
   * @remarks
   * Uses the following conversion rules:
   * - >= 365 days: years ('y')
   * - >= 30 days: months ('mo')
   * - >= 7 days: weeks ('w')
   * - < 7 days: days ('d')
   *
   * @example
   * ```ts
   * Formatter.duration(400)  // "1y"
   * Formatter.duration(45)   // "1mo"
   * Formatter.duration(14)   // "2w"
   * Formatter.duration(5)    // "5d"
   * ```
   *
   * @public
   */
  static duration(days: number): string {
    if (days >= 365) return `${Math.floor(days / 365)}y`
    if (days >= 30) return `${Math.floor(days / 30)}mo`
    if (days >= 7) return `${Math.floor(days / 7)}w`
    return `${days}d`
  }

  /**
   * Formats a file size in bytes into a human-readable string with appropriate unit.
   *
   * @param bytes - File size in bytes
   * @returns Formatted file size string with unit (B, KB, MB, GB, TB)
   *
   * @remarks
   * - Automatically selects the most appropriate unit based on size
   * - Uses 1024 as the conversion factor (binary prefix)
   * - Bytes displayed as integers, larger units with 1 decimal place
   *
   * @example
   * ```ts
   * Formatter.fileSize(512)           // "512 B"
   * Formatter.fileSize(1536)          // "1.5 KB"
   * Formatter.fileSize(1_572_864)     // "1.5 MB"
   * Formatter.fileSize(1_610_612_736) // "1.5 GB"
   * ```
   *
   * @public
   */
  static fileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
  }

  /**
   * Formats a number with optional decimal places and locale-specific formatting.
   *
   * @param value - The numeric value to format
   * @param decimals - Optional number of decimal places (uses locale formatting if omitted)
   * @returns Formatted number string
   *
   * @remarks
   * - With decimals specified: Uses toFixed() for exact decimal control
   * - Without decimals: Uses toLocaleString() for thousands separators
   *
   * @example
   * ```ts
   * Formatter.number(1234567)     // "1,234,567" (with locale separators)
   * Formatter.number(1234.567, 2) // "1234.57" (exact decimals)
   * Formatter.number(100, 0)      // "100"
   * ```
   *
   * @public
   */
  static number(value: number, decimals?: number): string {
    if (decimals !== undefined) {
      return value.toFixed(decimals)
    }
    return value.toLocaleString()
  }

  /**
   * Capitalizes the first letter of a string and lowercases the rest.
   *
   * @param str - The string to capitalize
   * @returns String with first letter uppercase and remaining letters lowercase
   *
   * @example
   * ```ts
   * Formatter.capitalize('hello')       // "Hello"
   * Formatter.capitalize('WORLD')       // "World"
   * Formatter.capitalize('hELLo WoRLd') // "Hello world"
   * ```
   *
   * @public
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  /**
   * Truncates a string to a maximum length and adds a suffix if truncated.
   *
   * @param str - The string to truncate
   * @param maxLength - Maximum length including suffix
   * @param suffix - String to append when truncated (default: '...')
   * @returns Original string if within limit, otherwise truncated string with suffix
   *
   * @remarks
   * The suffix length is included in maxLength calculation, so the resulting
   * string will never exceed maxLength characters.
   *
   * @example
   * ```ts
   * Formatter.truncate('Hello World', 8)           // "Hello..."
   * Formatter.truncate('Hi', 10)                   // "Hi"
   * Formatter.truncate('Long text here', 10, '~')  // "Long text~"
   * ```
   *
   * @public
   */
  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) return str
    return str.slice(0, maxLength - suffix.length) + suffix
  }

  /**
   * Converts a string to a URL-friendly slug format.
   *
   * @param str - The string to convert to a slug
   * @returns URL-safe slug string
   *
   * @remarks
   * Transformation steps:
   * 1. Converts to lowercase
   * 2. Trims whitespace
   * 3. Removes non-word characters (except spaces and hyphens)
   * 4. Replaces spaces, underscores, and multiple hyphens with single hyphen
   * 5. Removes leading/trailing hyphens
   *
   * @example
   * ```ts
   * Formatter.slugify('Hello World')        // "hello-world"
   * Formatter.slugify('My_Page Title!')     // "my-page-title"
   * Formatter.slugify('  trim   spaces  ')  // "trim-spaces"
   * Formatter.slugify('foo---bar')          // "foo-bar"
   * ```
   *
   * @public
   */
  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}