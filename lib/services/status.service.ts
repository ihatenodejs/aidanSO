import type {
  ServiceStatus,
  ServiceStatusResult,
  SystemHealth,
  StatusReport
} from '@/lib/types/status'
import type { Project } from '@/lib/types/project'
import { projects } from '@/lib/config/projects'
import type { ErrorType } from '@/lib/types'

/**
 * Service for monitoring domain and service availability.
 *
 * @remarks
 * This service provides comprehensive status monitoring for domains and services:
 * - Individual service health checks (HTTP 200 = operational)
 * - Aggregate system health reporting
 * - Response time tracking
 * - Error handling with timeouts
 *
 * All HTTP checks use a 10-second timeout to prevent hanging requests.
 * Services returning HTTP 200 are considered operational, all other status
 * codes or errors mark the service as down.
 *
 * @example
 * ```ts
 * import { StatusService } from '@/lib/services'
 *
 * // Check all services
 * const report = await StatusService.checkAllServices()
 * console.log(`Overall health: ${report.overallHealth}`)
 *
 * // Check if all systems operational
 * const allGood = await StatusService.areAllSystemsOperational()
 *
 * // Check individual service
 * const result = await StatusService.checkServiceStatus('https://aidxn.com')
 * ```
 *
 * @category Services
 * @public
 */
type ServiceCheckResult = {
  status: ServiceStatus
  statusCode: number | null
  responseTime: number | null
  error: string | null
  errorType: ErrorType | null
  checkedAt: Date
}

export class StatusService {
  /** Timeout for HTTP requests in milliseconds */
  private static readonly REQUEST_TIMEOUT = 10000

  /**
   * Checks the operational status of a single service URL.
   *
   * @param url - The URL to check (must be absolute)
   * @returns {Promise<ServiceCheckResult>} Status result with response time and error details
   *
   * @remarks
   * Makes an HTTP HEAD request to the URL (falls back to GET if HEAD not supported).
   * Returns `operational` status for any 2xx or 3xx response.
   * Tracks response time in milliseconds.
   * Automatically times out after 10 seconds.
   *
   * @example
   * ```ts
   * const result = await StatusService.checkServiceStatus('https://example.com')
   *
   * if (result.status === 'operational') {
   *   console.log(`Service up! Response time: ${result.responseTime}ms`)
   * } else {
   *   console.error(`Service down: ${result.error}`)
   * }
   * ```
   *
   * @public
   */
  static async checkServiceStatus(url: string): Promise<ServiceCheckResult> {
    const responses: Array<{
      method: 'HEAD' | 'GET'
      response: Response
      responseTime: number
    }> = []
    const errors: Array<{
      method: 'HEAD' | 'GET'
      error: unknown
      responseTime: number
    }> = []

    const attemptRequest = async (method: 'HEAD' | 'GET') => {
      const startTime = Date.now()
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.REQUEST_TIMEOUT
      )

      try {
        const response = await fetch(url, {
          method,
          signal: controller.signal,
          redirect: 'follow',
          // Don't cache status checks
          cache: 'no-store'
        })

        const responseTime = Date.now() - startTime
        responses.push({ method, response, responseTime })
      } catch (error) {
        const responseTime = Date.now() - startTime
        errors.push({ method, error, responseTime })
      } finally {
        clearTimeout(timeoutId)
      }
    }

    await attemptRequest('HEAD')

    const lastResponse = responses.length
      ? responses[responses.length - 1]
      : null
    const shouldFallbackToGet =
      !lastResponse ||
      !StatusService.isOperationalStatus(lastResponse.response.status)

    if (shouldFallbackToGet) {
      await attemptRequest('GET')
    }

    const finalResponse = responses.length
      ? responses[responses.length - 1]
      : null

    if (finalResponse) {
      const { response, responseTime } = finalResponse
      const operational = StatusService.isOperationalStatus(response.status)
      const status: ServiceStatus = operational ? 'operational' : 'down'

      return {
        status,
        statusCode: response.status,
        responseTime,
        error: operational ? null : `HTTP ${response.status}`,
        errorType: operational ? null : 'server',
        checkedAt: new Date()
      }
    }

    const finalError = errors.length ? errors[errors.length - 1] : null

    if (finalError) {
      const { error, responseTime } = finalError
      const { errorMessage, errorType } = StatusService.mapRequestError(error)

      return {
        status: 'down',
        statusCode: null,
        responseTime:
          responseTime >= this.REQUEST_TIMEOUT ? null : responseTime,
        error: errorMessage,
        errorType,
        checkedAt: new Date()
      }
    }

    return {
      status: 'down',
      statusCode: null,
      responseTime: null,
      error: 'Unknown error',
      errorType: 'unknown',
      checkedAt: new Date()
    }
  }

  private static isOperationalStatus(status: number): boolean {
    return status >= 200 && status < 400
  }

  private static mapRequestError(error: unknown): {
    errorMessage: string
    errorType: ErrorType
  } {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { errorMessage: 'Request timeout', errorType: 'timeout' }
      }

      const message = error.message.toLowerCase()

      if (message.includes('fetch') || message.includes('network')) {
        return { errorMessage: 'Network error', errorType: 'network' }
      }

      if (message.includes('dns') || message.includes('lookup')) {
        return { errorMessage: 'Network error', errorType: 'network' }
      }

      return { errorMessage: error.message, errorType: 'unknown' }
    }

    return { errorMessage: 'Unknown error', errorType: 'unknown' }
  }

  /**
   * Retrieves all monitored projects from configuration.
   *
   * @param includeInactive - Whether to include projects not being tracked (default: false)
   * @returns {Project[]} Array of all projects to monitor
   *
   * @remarks
   * By default, only returns projects with status tracking enabled (trackStatus: true).
   * Inactive projects are expected to be down and are hidden from monitoring.
   *
   * @example
   * ```ts
   * // Get only actively monitored projects (default)
   * const monitoredProjects = StatusService.getAllMonitoredProjects()
   * console.log(`Monitoring ${monitoredProjects.length} projects`)
   *
   * // Get all projects including those not tracked
   * const allProjects = StatusService.getAllMonitoredProjects(true)
   *
   * // Filter by service category
   * const personalProjects = monitoredProjects.filter(p => p.serviceCategory === 'personal')
   * ```
   *
   * @public
   */
  static getAllMonitoredProjects(includeInactive = false): Project[] {
    if (includeInactive) {
      return projects
    }
    return projects.filter((p) => p.serviceInfo.trackStatus)
  }

  /**
   * Checks the status of all monitored services from the server perspective.
   *
   * @returns {Promise<StatusReport>} Complete status report with server-side measurements
   *
   * @public
   */
  static async checkAllServicesFromServer(): Promise<StatusReport> {
    const monitoredProjects = this.getAllMonitoredProjects()

    const results = await Promise.all(
      monitoredProjects.map(async (project) => {
        const url = `https://${project.domain}`
        const measurement = await this.checkServiceStatus(url)

        const result: ServiceStatusResult = {
          project,
          status: measurement.status,
          statusCode: measurement.statusCode,
          responseTime: null,
          serverResponseTime: measurement.responseTime,
          error: measurement.error,
          errorType: measurement.errorType,
          checkedAt: measurement.checkedAt
        }

        return result
      })
    )

    const stats = {
      total: results.length,
      operational: results.filter((r) => r.status === 'operational').length,
      down: results.filter((r) => r.status === 'down').length,
      checking: results.filter((r) => r.status === 'checking').length
    }

    const anyDown = results.some((r) => r.status === 'down')
    const allDown = results.every((r) => r.status === 'down')

    let overallHealth: SystemHealth
    if (allDown) {
      overallHealth = 'full_outage'
    } else if (anyDown) {
      overallHealth = 'partial_outage'
    } else {
      overallHealth = 'operational'
    }

    return {
      overallHealth,
      services: results,
      stats,
      checkedAt: new Date()
    }
  }

  /**
   * Checks the status of all monitored services.
   *
   * @returns {Promise<StatusReport>} Complete status report with individual results and overall health
   *
   * @remarks
   * Performs parallel status checks on all configured services using the server
   * perspective. Calculated metrics match {@link checkAllServicesFromServer}.
   *
   * @example
   * ```ts
   * const report = await StatusService.checkAllServices()
   *
   * console.log(`System health: ${report.overallHealth}`)
   * console.log(`${report.stats.operational}/${report.stats.total} services operational`)
   *
   * // Find down services
   * const downServices = report.services.filter(s => s.status === 'down')
   * downServices.forEach(s => {
   *   console.error(`${s.service.name} is down: ${s.error}`)
   * })
   * ```
   *
   * @public
   */
  static async checkAllServices(): Promise<StatusReport> {
    return this.checkAllServicesFromServer()
  }

  /**
   * Checks if all systems are operational.
   *
   * @returns {Promise<boolean>} True if all services return HTTP 200
   *
   * @remarks
   * This is a simplified check that returns true only when all services are operational.
   * Use this for quick health checks like the footer status indicator.
   * Returns false if any service is down.
   *
   * @example
   * ```ts
   * const allGood = await StatusService.areAllSystemsOperational()
   *
   * if (allGood) {
   *   console.log('✓ All Systems Operational')
   * } else {
   *   console.warn('⚠ Service disruption detected')
   * }
   * ```
   *
   * @public
   */
  static async areAllSystemsOperational(): Promise<boolean> {
    const report = await this.checkAllServices()
    return report.overallHealth === 'operational'
  }

  /**
   * Groups monitored projects by service category.
   *
   * @returns {Record<'personal' | 'project', Project[]>} Projects grouped by service category
   *
   * @example
   * ```ts
   * const grouped = StatusService.groupProjectsByCategory()
   * console.log(`Personal projects: ${grouped.personal.length}`)
   * console.log(`Project services: ${grouped.project.length}`)
   * ```
   *
   * @public
   */
  static groupProjectsByCategory(): Record<'personal' | 'project', Project[]> {
    const monitoredProjects = this.getAllMonitoredProjects()

    return {
      personal: monitoredProjects.filter(
        (p) => p.serviceCategory === 'personal'
      ),
      project: monitoredProjects.filter((p) => p.serviceCategory === 'project')
    }
  }
}
