/**
 * Shared type definitions for service layer operations.
 *
 * @remarks
 * This module contains reusable types for common service patterns:
 * - Filtering and sorting configurations
 * - Statistics and aggregation results
 * - Query options and pagination
 *
 * @module lib/types/service
 * @category Types
 */

/**
 * Sort order direction for list operations.
 *
 * @example
 * ```ts
 * const order: SortOrder = 'asc' // Ascending order
 * const descOrder: SortOrder = 'desc' // Descending order
 * ```
 *
 * @public
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Configuration for sorting operations on typed entities.
 *
 * @template T - The entity type being sorted
 *
 * @remarks
 * Provides type-safe sorting configuration with:
 * - Compile-time verification of sort key
 * - Order direction (ascending/descending)
 *
 * @example
 * ```ts
 * interface User {
 *   name: string
 *   age: number
 *   createdAt: Date
 * }
 *
 * const config: SortConfig<User> = {
 *   sortBy: 'age',
 *   order: 'desc'
 * }
 * ```
 *
 * @public
 */
export interface SortConfig<T> {
  /** Property key to sort by (type-safe) */
  sortBy: keyof T
  /** Sort direction */
  order: SortOrder
}

/**
 * Generic filter configuration for entity queries.
 *
 * @template T - The entity type being filtered
 *
 * @remarks
 * Provides a flexible filtering system where:
 * - Keys are entity properties
 * - Values can be exact matches or undefined (no filter)
 *
 * This enables type-safe, partial filtering of entities.
 *
 * @example
 * ```ts
 * interface Product {
 *   category: string
 *   inStock: boolean
 *   price: number
 * }
 *
 * const filters: FilterConfig<Product> = {
 *   category: 'electronics',
 *   inStock: true
 *   // price is omitted (not filtered)
 * }
 * ```
 *
 * @public
 */
export type FilterConfig<T> = Partial<T>

/**
 * Statistics result containing aggregate metrics.
 *
 * @remarks
 * Common return type for service methods that compute statistics.
 * Includes:
 * - Total count
 * - Category/group breakdowns
 * - Additional metrics as key-value pairs
 *
 * @example
 * ```ts
 * const stats: StatsResult = {
 *   total: 150,
 *   byCategory: {
 *     active: 120,
 *     inactive: 30
 *   },
 *   averageAge: 2.5,
 *   newestItem: {...}
 * }
 * ```
 *
 * @public
 */
export interface StatsResult {
  /** Total count of items */
  total: number
  /** Breakdown by categories */
  byCategory?: Record<string, number>
  /** Additional computed metrics */
  [key: string]: number | Record<string, number> | unknown | undefined
}

/**
 * Date range configuration for time-based queries.
 *
 * @remarks
 * Supports both absolute dates and relative ranges.
 * Used for filtering time-series data.
 *
 * @example
 * ```ts
 * // Absolute range
 * const range: DateRangeConfig = {
 *   start: new Date('2025-01-01'),
 *   end: new Date('2025-01-31')
 * }
 *
 * // Relative range
 * const lastMonth: DateRangeConfig = {
 *   relativeDays: 30
 * }
 * ```
 *
 * @public
 */
export interface DateRangeConfig {
  /** Start date (inclusive) */
  start?: Date
  /** End date (inclusive) */
  end?: Date
  /** Relative days from now (alternative to start/end) */
  relativeDays?: number
  /** Relative months from now (alternative to start/end) */
  relativeMonths?: number
}

/**
 * Pagination configuration for list operations.
 *
 * @remarks
 * Standard pagination pattern with:
 * - Page number (1-indexed)
 * - Items per page
 * - Optional offset-based pagination
 *
 * @example
 * ```ts
 * // Page-based pagination
 * const config: PaginationConfig = {
 *   page: 2,
 *   pageSize: 25
 * }
 *
 * // Offset-based pagination
 * const offsetConfig: PaginationConfig = {
 *   page: 1,
 *   pageSize: 25,
 *   offset: 50
 * }
 * ```
 *
 * @public
 */
export interface PaginationConfig {
  /** Current page number (1-indexed) */
  page: number
  /** Number of items per page */
  pageSize: number
  /** Optional offset for cursor-based pagination */
  offset?: number
}

/**
 * Paginated result set with metadata.
 *
 * @template T - Type of items in the result
 *
 * @remarks
 * Standard response format for paginated queries, including:
 * - Data items
 * - Total count
 * - Current page info
 * - Navigation metadata
 *
 * @example
 * ```ts
 * const result: PaginatedResult<User> = {
 *   items: [...],
 *   total: 150,
 *   page: 2,
 *   pageSize: 25,
 *   totalPages: 6,
 *   hasMore: true
 * }
 * ```
 *
 * @public
 */
export interface PaginatedResult<T> {
  /** Items for current page */
  items: T[]
  /** Total count across all pages */
  total: number
  /** Current page number */
  page: number
  /** Items per page */
  pageSize: number
  /** Total number of pages */
  totalPages: number
  /** Whether more pages exist */
  hasMore: boolean
}

/**
 * Query options combining common patterns.
 *
 * @template T - Entity type being queried
 *
 * @remarks
 * Comprehensive query configuration supporting:
 * - Filtering
 * - Sorting
 * - Pagination
 * - Date ranges
 *
 * Designed for flexible, composable queries.
 *
 * @example
 * ```ts
 * interface Product {
 *   name: string
 *   price: number
 *   createdAt: Date
 * }
 *
 * const options: QueryOptions<Product> = {
 *   filters: { price: 50 },
 *   sort: { sortBy: 'createdAt', order: 'desc' },
 *   pagination: { page: 1, pageSize: 20 },
 *   dateRange: { relativeDays: 30 }
 * }
 * ```
 *
 * @public
 */
export interface QueryOptions<T> {
  /** Filter configuration */
  filters?: FilterConfig<T>
  /** Sort configuration */
  sort?: SortConfig<T>
  /** Pagination settings */
  pagination?: PaginationConfig
  /** Date range filter */
  dateRange?: DateRangeConfig
}

/**
 * Service method result wrapper with metadata.
 *
 * @template T - Type of the result data
 *
 * @remarks
 * Standard envelope for service responses, providing:
 * - Success/failure status
 * - Result data or error
 * - Optional metadata
 *
 * Enables consistent error handling across services.
 *
 * @example
 * ```ts
 * // Success result
 * const success: ServiceResult<User> = {
 *   success: true,
 *   data: { id: 1, name: 'Alice' }
 * }
 *
 * // Error result
 * const error: ServiceResult<User> = {
 *   success: false,
 *   error: 'User not found'
 * }
 *
 * // With metadata
 * const withMeta: ServiceResult<User[]> = {
 *   success: true,
 *   data: [...],
 *   metadata: { cached: true, timestamp: Date.now() }
 * }
 * ```
 *
 * @public
 */
export interface ServiceResult<T> {
  /** Whether the operation succeeded */
  success: boolean
  /** Result data (present if success=true) */
  data?: T
  /** Error message (present if success=false) */
  error?: string
  /** Optional metadata about the operation */
  metadata?: Record<string, unknown>
}

/**
 * Comparison operator for advanced filtering.
 *
 * @remarks
 * Used in complex filter expressions to specify:
 * - Equality checks
 * - Range queries
 * - Existence checks
 *
 * @example
 * ```ts
 * const op: FilterOperator = 'gte' // Greater than or equal
 * ```
 *
 * @public
 */
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'exists'

/**
 * Advanced filter expression with operators.
 *
 * @template T - Value type being filtered
 *
 * @remarks
 * Enables complex query expressions beyond simple equality.
 * Similar to MongoDB query syntax.
 *
 * @example
 * ```ts
 * // Range filter
 * const ageFilter: FilterExpression<number> = {
 *   operator: 'gte',
 *   value: 18
 * }
 *
 * // Array inclusion filter
 * const statusFilter: FilterExpression<string> = {
 *   operator: 'in',
 *   value: ['active', 'pending']
 * }
 * ```
 *
 * @public
 */
export interface FilterExpression<T> {
  /** Comparison operator */
  operator: FilterOperator
  /** Value to compare against */
  value: T | T[]
}