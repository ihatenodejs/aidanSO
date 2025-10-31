/**
 * Type definitions for system status monitoring.
 *
 * @remarks
 * This module provides type definitions for tracking the operational status
 * of monitored domains and services. Status checks verify if services return
 * HTTP 200 (operational) or any other status code (down).
 *
 * @module lib/types/status
 * @category Types
 * @public
 */

import type { Project } from './project'

/**
 * Operational status of a monitored service.
 *
 * @remarks
 * - `operational`: Service returned HTTP 200
 * - `down`: Service returned non-200 status or failed to respond
 * - `checking`: Status check is currently in progress
 *
 * @category Types
 * @public
 */
export type ServiceStatus = 'operational' | 'down' | 'checking'

/**
 * Type of error that occurred during status check.
 *
 * @remarks
 * - `network`: Network-level error (DNS, connection refused, etc.)
 * - `timeout`: Request exceeded timeout threshold
 * - `server`: Server returned non-200 status code
 * - `cors`: CORS-related error (browser-only)
 * - `unknown`: Unclassified error
 *
 * @category Types
 * @public
 */
export type ErrorType = 'network' | 'timeout' | 'server' | 'cors' | 'unknown'

/**
 * Result of a service status check.
 *
 * @remarks
 * Contains the service metadata along with its current operational status,
 * HTTP status code (if available), response time, and any error information.
 *
 * @example
 * ```ts
 * const result: ServiceStatusResult = {
 *   project: someProject,
 *   status: 'operational',
 *   statusCode: 200,
 *   responseTime: 312,
 *   serverResponseTime: 145,
 *   error: null,
 *   errorType: null,
 *   checkedAt: new Date()
 * }
 * ```
 *
 * @category Types
 * @public
 */
export interface ServiceStatusResult {
  /** The project/service that was checked */
  project: Project
  /** Current operational status */
  status: ServiceStatus
  /** HTTP status code from the check (null if request failed) */
  statusCode: number | null
  /** Response time in milliseconds measured from the client/browser (null if not collected) */
  responseTime: number | null
  /** Response time in milliseconds from server perspective (null if timeout/error or not measured) */
  serverResponseTime: number | null
  /** Error message if the check failed */
  error: string | null
  /** Type of error that occurred (null if operational) */
  errorType?: ErrorType | null
  /** Timestamp when the check was performed */
  checkedAt: Date
}

/**
 * Overall system health status.
 *
 * @remarks
 * Aggregates the status of all monitored services to determine overall health:
 * - `operational`: All services are operational
 * - `partial_outage`: At least one service is down
 * - `full_outage`: All monitored services are down
 *
 * @category Types
 * @public
 */
export type SystemHealth = 'operational' | 'partial_outage' | 'full_outage'

/**
 * Complete status report for all monitored services.
 *
 * @remarks
 * Provides a comprehensive view of system health including individual service
 * statuses, overall health assessment, and summary statistics.
 *
 * @example
 * ```ts
 * const report: StatusReport = {
 *   overallHealth: 'operational',
 *   services: serviceResults,
 *   stats: {
 *     total: 5,
 *     operational: 5,
 *     down: 0,
 *     checking: 0
 *   },
 *   checkedAt: new Date()
 * }
 * ```
 *
 * @category Types
 * @public
 */
export interface StatusReport {
  /** Overall system health assessment */
  overallHealth: SystemHealth
  /** Individual service status results */
  services: ServiceStatusResult[]
  /** Summary statistics */
  stats: {
    /** Total number of monitored services */
    total: number
    /** Number of operational services */
    operational: number
    /** Number of down services */
    down: number
    /** Number of services currently being checked */
    checking: number
  }
  /** Timestamp when the report was generated */
  checkedAt: Date
}
