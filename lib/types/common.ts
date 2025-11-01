/**
 * Common utility types used across my website
 *
 * @remarks
 * This module provides fundamental type definitions for date handling,
 * filtering, and pagination. These types are used throughout
 * the application to ensure type safety and consistency.
 *
 * @module lib/types/common
 * @category Types
 * @public
 */

/**
 * Represents a time range with start and end dates.
 *
 * @remarks
 * Used for filtering data by date ranges, such as analytics queries,
 * domain renewal periods, or session time windows.
 *
 * @example
 * ```ts
 * import type { DateRange } from '@/lib/types/common'
 *
 * // Last 30 days
 * const last30Days: DateRange = {
 *   start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
 *   end: new Date()
 * }
 *
 * // Specific date range
 * const Q1: DateRange = {
 *   start: new Date('2025-01-01'),
 *   end: new Date('2025-03-31')
 * }
 * ```
 *
 * @category Types
 * @public
 */
export interface DateRange {
  /** Start date of the range (inclusive) */
  start: Date
  /** End date of the range (inclusive) */
  end: Date
}

/**
 * Date object with pre-computed formatted strings.
 *
 * @remarks
 * This type is useful when you need to display dates in multiple formats
 * and want to avoid repeated formatting operations. Commonly used in
 * components that display dates in both human-readable and machine-readable formats.
 *
 * @example
 * ```ts
 * import type { FormattedDate } from '@/lib/types/common'
 * import { Formatter } from '@/lib/utils'
 *
 * const registrationDate: FormattedDate = {
 *   date: new Date('2023-05-15'),
 *   formatted: 'May 15, 2023',
 *   iso: '2023-05-15T00:00:00.000Z'
 * }
 *
 * // Usage in components
 * <time dateTime={registrationDate.iso}>
 *   {registrationDate.formatted}
 * </time>
 * ```
 *
 * @category Types
 * @public
 */
export interface FormattedDate {
  /** Original Date object */
  date: Date
  /** Human-readable formatted string (e.g., "May 15, 2023") */
  formatted: string
  /** ISO 8601 formatted string for machine readability */
  iso: string
}
