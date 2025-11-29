import type { DeviceSpec, DeviceType, DeviceWithMetrics } from '@/lib/types'
import type { SortOrder } from '@/lib/types/service'
import type { ClientDevice } from '@/lib/types/client-device'
import { devices as deviceData } from '@/lib/config/devices/client'

/**
 * Converts client device data to DeviceSpec format.
 * Client devices use string icon identifiers while DeviceSpec uses React components.
 * This service works with the base data structure and ignores icon differences.
 */
function convertClientDeviceToSpec(clientDevice: ClientDevice): DeviceSpec {
  return clientDevice as unknown as DeviceSpec
}

/**
 * Get all devices as DeviceSpec array
 */
function getAllDeviceSpecs(): DeviceSpec[] {
  return Object.values(deviceData).map(convertClientDeviceToSpec)
}

/**
 * Statistics and aggregated metrics for the device portfolio.
 *
 * @remarks
 * Provides a comprehensive snapshot of device collection metrics including
 * type distribution, manufacturer breakdown, age statistics, and device lifecycle data.
 *
 * @example
 * ```ts
 * const stats = DeviceService.getDeviceStats()
 * console.log(`Total devices: ${stats.total}`)
 * console.log(`Mobile devices: ${stats.mobile}`)
 * console.log(`Average age: ${stats.averageAge.toFixed(1)} years`)
 * ```
 *
 * @category Services
 * @public
 */
export interface DevicePortfolioStats {
  /** Total number of devices in the portfolio */
  total: number
  /** Number of mobile devices */
  mobile: number
  /** Number of digital audio players (DAPs) */
  dap: number
  /** Device count grouped by manufacturer name */
  byManufacturer: Record<string, number>
  /** Average age of all devices in years */
  averageAge: number
  /** Most recently released device */
  newestDevice: DeviceWithMetrics
  /** Oldest device by release year */
  oldestDevice: DeviceWithMetrics
}

/**
 * Service for managing device data and computing device metrics.
 *
 * @remarks
 * Provides a centralized API for device portfolio management including:
 * - Device enrichment with computed metrics (age, category labels)
 * - Filtering by type, manufacturer, status, and release year
 * - Sorting with type-safe key selection
 * - Portfolio statistics and analytics
 * - Related device discovery
 *
 * All methods are static and operate on the device data store without side effects.
 *
 * @example
 * ```ts
 * import { DeviceService } from '@/lib/services'
 *
 * // Get all enriched devices
 * const devices = DeviceService.getAllDevicesEnriched()
 *
 * // Filter mobile devices only
 * const mobile = DeviceService.getMobileDevices()
 *
 * // Get statistics
 * const stats = DeviceService.getDeviceStats()
 * console.log(`You have ${stats.total} devices`)
 *
 * // Find related devices
 * const device = DeviceService.getDeviceBySlug('bonito')
 * const related = DeviceService.getRelatedDevices(device!)
 * ```
 *
 * @category Services
 * @public
 */
export class DeviceService {
  /**
   * Computes the age of a device in years since release.
   *
   * @param device - Device specification
   * @returns {number} Years since release, or 0 if no release year
   * @internal
   */
  private static computeAgeInYears(device: DeviceSpec): number {
    if (!device.releaseYear) return 0
    return new Date().getFullYear() - device.releaseYear
  }

  /**
   * Checks if a device was released in the current year.
   *
   * @param device - Device specification
   * @returns {boolean} True if released this year
   * @internal
   */
  private static isCurrentYear(device: DeviceSpec): boolean {
    if (!device.releaseYear) return false
    return device.releaseYear === new Date().getFullYear()
  }

  /**
   * Determines a human-readable category label based on device type and status.
   *
   * @param device - Device specification
   * @returns {string} Label like 'Daily Driver', 'Beta Testing', 'Digital Audio Player'
   * @internal
   */
  private static getCategoryLabel(device: DeviceSpec): string {
    if (device.type === 'mobile') {
      if (device.status?.toLowerCase().includes('daily')) return 'Daily Driver'
      if (device.status?.toLowerCase().includes('beta')) return 'Beta Testing'
      if (device.status?.toLowerCase().includes('experiment'))
        return 'Experimental'
      return 'Mobile Device'
    }
    if (device.type === 'dap') {
      return 'Digital Audio Player'
    }
    return 'Device'
  }

  /**
   * Enriches a device specification with computed metrics.
   *
   * @param device - The device specification to enrich
   * @returns {DeviceWithMetrics} Device with added properties:
   *   - `ageInYears: number` - Years since release
   *   - `isCurrentYear: boolean` - Released in current year
   *   - `categoryLabel: string` - Human-readable category ('Daily Driver', 'Digital Audio Player', etc.)
   *
   * @example
   * ```ts
   * const rawDevice = { slug: 'bonito', name: 'Pixel 3a XL', releaseYear: 2019, type: 'mobile', ... }
   * const enriched = DeviceService.enrichDevice(rawDevice)
   * console.log(enriched.ageInYears) // 6 (as of 2025)
   * console.log(enriched.categoryLabel) // 'Mobile Device'
   * ```
   */
  static enrichDevice(device: DeviceSpec): DeviceWithMetrics {
    return {
      ...device,
      ageInYears: this.computeAgeInYears(device),
      isCurrentYear: this.isCurrentYear(device),
      categoryLabel: this.getCategoryLabel(device)
    }
  }

  /**
   * Retrieves all devices from the data store.
   *
   * @returns {DeviceSpec[]} Array of all device specifications
   *
   * @example
   * ```ts
   * const devices = DeviceService.getAllDevices()
   * console.log(`Found ${devices.length} devices`)
   * ```
   */
  static getAllDevices(): DeviceSpec[] {
    return getAllDeviceSpecs()
  }

  /**
   * Retrieves all devices with enriched metrics.
   *
   * @returns {DeviceWithMetrics[]} Array of all devices with computed properties
   *
   * @example
   * ```ts
   * const enriched = DeviceService.getAllDevicesEnriched()
   * enriched.forEach(device => {
   *   console.log(`${device.name} is ${device.ageInYears} years old`)
   * })
   * ```
   */
  static getAllDevicesEnriched(): DeviceWithMetrics[] {
    return this.getAllDevices().map((device) => this.enrichDevice(device))
  }

  /**
   * Retrieves a single device by its slug identifier.
   *
   * @param slug - The device slug (e.g., 'bonito', 'cheetah')
   * @returns {DeviceWithMetrics | null} Enriched device or null if not found
   *
   * @example
   * ```ts
   * const device = DeviceService.getDeviceBySlug('bonito')
   * if (device) {
   *   console.log(`Found: ${device.name}`)
   * }
   * ```
   */
  static getDeviceBySlug(slug: string): DeviceWithMetrics | null {
    const clientDevice = deviceData[slug]
    if (!clientDevice) return null
    const device = convertClientDeviceToSpec(clientDevice)
    return this.enrichDevice(device)
  }

  /**
   * Filters devices based on multiple criteria.
   *
   * @param filters - Filter criteria
   * @param filters.type - Device type to filter by
   * @param filters.manufacturer - Manufacturer name to filter by
   * @param filters.status - Status string to filter by
   * @param filters.releaseYear - Release year to filter by
   * @returns {DeviceWithMetrics[]} Array of enriched devices matching all specified filters
   *
   * @example
   * ```ts
   * const mobileDevices = DeviceService.filterDevices({ type: 'mobile' })
   * const googleDevices = DeviceService.filterDevices({ manufacturer: 'Google' })
   * ```
   */
  static filterDevices(filters: {
    type?: DeviceType
    manufacturer?: string
    status?: string
    releaseYear?: number
  }): DeviceWithMetrics[] {
    let filtered = this.getAllDevices()

    if (filters.type) {
      filtered = filtered.filter((d) => d.type === filters.type)
    }

    if (filters.manufacturer) {
      filtered = filtered.filter((d) => d.manufacturer === filters.manufacturer)
    }

    if (filters.status) {
      filtered = filtered.filter((d) => d.status === filters.status)
    }

    if (filters.releaseYear) {
      filtered = filtered.filter((d) => d.releaseYear === filters.releaseYear)
    }

    return filtered.map((d) => this.enrichDevice(d))
  }

  /**
   * Retrieves devices filtered by device type.
   *
   * @param type - Device type ('mobile' or 'dap')
   * @returns {DeviceWithMetrics[]} Array of enriched devices matching the type
   *
   * @remarks
   * This is a convenience wrapper around `filterDevices()` for type-based filtering.
   *
   * @example
   * ```ts
   * const mobileDevices = DeviceService.getDevicesByType('mobile')
   * const daps = DeviceService.getDevicesByType('dap')
   * ```
   */
  static getDevicesByType(type: DeviceType): DeviceWithMetrics[] {
    return this.filterDevices({ type })
  }

  /**
   * Retrieves all mobile devices from the portfolio.
   *
   * @returns {DeviceWithMetrics[]} Array of enriched mobile devices
   *
   * @remarks
   * Convenience method equivalent to `getDevicesByType('mobile')`.
   *
   * @example
   * ```ts
   * const mobile = DeviceService.getMobileDevices()
   * console.log(`You have ${mobile.length} mobile devices`)
   * ```
   */
  static getMobileDevices(): DeviceWithMetrics[] {
    return this.getDevicesByType('mobile')
  }

  /**
   * Retrieves all digital audio players (DAPs) from the portfolio.
   *
   * @returns {DeviceWithMetrics[]} Array of enriched DAP devices
   *
   * @remarks
   * Convenience method equivalent to `getDevicesByType('dap')`.
   *
   * @example
   * ```ts
   * const daps = DeviceService.getDAPDevices()
   * console.log(`You have ${daps.length} DAPs`)
   * ```
   */
  static getDAPDevices(): DeviceWithMetrics[] {
    return this.getDevicesByType('dap')
  }

  /**
   * Sorts devices by a specified property in ascending or descending order.
   *
   * @param devices - Array of devices to sort
   * @param sortBy - Property key to sort by (type-safe, must be valid DeviceWithMetrics key)
   * @param order - Sort direction ('asc' or 'desc'), defaults to 'asc'
   * @returns {DeviceWithMetrics[]} New sorted array (original array is not modified)
   *
   * @remarks
   * - Creates a shallow copy to avoid mutating the input array
   * - Handles undefined values by placing them at the end (asc) or start (desc)
   * - Works with any comparable property (strings, numbers, etc.)
   *
   * @example
   * ```ts
   * const devices = DeviceService.getAllDevicesEnriched()
   *
   * // Sort by release year, newest first
   * const newest = DeviceService.sortDevices(devices, 'releaseYear', 'desc')
   *
   * // Sort by name alphabetically
   * const alphabetical = DeviceService.sortDevices(devices, 'name', 'asc')
   *
   * // Sort by age
   * const oldest = DeviceService.sortDevices(devices, 'ageInYears', 'desc')
   * ```
   */
  static sortDevices(
    devices: DeviceWithMetrics[],
    sortBy: keyof DeviceWithMetrics,
    order: SortOrder = 'asc'
  ): DeviceWithMetrics[] {
    return [...devices].sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]

      if (aVal === undefined || bVal === undefined) {
        if (aVal === undefined && bVal === undefined) return 0
        if (aVal === undefined) return order === 'asc' ? 1 : -1
        return order === 'asc' ? -1 : 1
      }

      if (aVal === bVal) return 0

      const comparison = aVal < bVal ? -1 : 1
      return order === 'asc' ? comparison : -comparison
    })
  }

  /**
   * Finds related devices based on shared type and manufacturer.
   *
   * @param device - The reference device to find related devices for
   * @returns {DeviceWithMetrics[]} Up to 3 related devices (excludes the input device)
   *
   * @remarks
   * The algorithm prioritizes devices that share:
   * 1. Same device type (mobile or DAP)
   * 2. Same manufacturer
   *
   * The method deduplicates results using a Map and returns up to 3 devices.
   * Useful for "You might also like" or related device suggestions.
   *
   * @example
   * ```ts
   * const pixel3a = DeviceService.getDeviceBySlug('bonito')
   * if (pixel3a) {
   *   const related = DeviceService.getRelatedDevices(pixel3a)
   *   console.log(`Related devices: ${related.map(d => d.name).join(', ')}`)
   *   // Example output: "Pixel 7a, Pixel 3, Pixel 4a"
   * }
   * ```
   *
   * @example
   * ```ts
   * // For a Samsung DAP, finds other DAPs and Samsung devices
   * const dap = DeviceService.getDeviceBySlug('komodo')
   * const similar = DeviceService.getRelatedDevices(dap!)
   * ```
   */
  static getRelatedDevices(device: DeviceSpec): DeviceWithMetrics[] {
    const sameType = this.filterDevices({ type: device.type }).filter(
      (d) => d.slug !== device.slug
    )

    const sameManufacturer = device.manufacturer
      ? this.filterDevices({ manufacturer: device.manufacturer }).filter(
          (d) => d.slug !== device.slug
        )
      : []

    const combined = new Map<string, DeviceWithMetrics>()

    sameType.forEach((d) => combined.set(d.slug, d))
    sameManufacturer.forEach((d) => combined.set(d.slug, d))

    return Array.from(combined.values()).slice(0, 3)
  }

  /**
   * Computes comprehensive statistics for the entire device portfolio.
   *
   * @returns {DevicePortfolioStats} Aggregated portfolio metrics
   *
   * @remarks
   * Calculates portfolio-wide statistics including:
   * - Type distribution (mobile vs DAP)
   * - Manufacturer breakdown
   * - Average device age
   * - Newest and oldest devices
   *
   * All devices are enriched with metrics before calculations.
   *
   * @example
   * ```ts
   * const stats = DeviceService.getDeviceStats()
   *
   * console.log(`Portfolio Overview:`)
   * console.log(`Total: ${stats.total} devices`)
   * console.log(`Mobile: ${stats.mobile}, DAP: ${stats.dap}`)
   * console.log(`Average age: ${stats.averageAge.toFixed(1)} years`)
   * console.log(`Newest: ${stats.newestDevice.name}`)
   * console.log(`Oldest: ${stats.oldestDevice.name}`)
   *
   * // Manufacturer breakdown
   * Object.entries(stats.byManufacturer).forEach(([mfr, count]) => {
   *   console.log(`${mfr}: ${count} devices`)
   * })
   * ```
   *
   * @example
   * ```ts
   * // Use for dashboard summary cards
   * const stats = DeviceService.getDeviceStats()
   * return (
   *   <div>
   *     <StatsCard label="Total Devices" value={stats.total} />
   *     <StatsCard label="Mobile" value={stats.mobile} />
   *     <StatsCard label="Average Age" value={`${stats.averageAge.toFixed(1)}y`} />
   *   </div>
   * )
   * ```
   */
  static getDeviceStats(): DevicePortfolioStats {
    const enriched = this.getAllDevicesEnriched()

    return {
      total: enriched.length,
      mobile: enriched.filter((d) => d.type === 'mobile').length,
      dap: enriched.filter((d) => d.type === 'dap').length,
      byManufacturer: enriched.reduce(
        (acc, d) => {
          if (d.manufacturer) {
            acc[d.manufacturer] = (acc[d.manufacturer] || 0) + 1
          }
          return acc
        },
        {} as Record<string, number>
      ),
      averageAge:
        enriched.reduce((sum, d) => sum + d.ageInYears, 0) / enriched.length,
      newestDevice: this.sortDevices(enriched, 'releaseYear', 'desc')[0],
      oldestDevice: this.sortDevices(enriched, 'releaseYear', 'asc')[0]
    }
  }
}
