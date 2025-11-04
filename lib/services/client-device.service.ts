/**
 * Client-side device service for use in browser components
 * Works with client-safe device data that doesn't include React components
 */

import type { DeviceType } from '@/lib/types'
import type {
  ClientDevice,
  ClientDeviceWithMetrics
} from '@/lib/types/client-device'
import type { SortOrder } from '@/lib/types/service'
import { devices as deviceData } from '@/lib/config/devices/client'

/**
 * Client-side device service that works with pre-built client-safe data
 */
export class ClientDeviceService {
  /**
   * Computes the age of a device in years since release.
   */
  private static computeAgeInYears(device: ClientDevice): number {
    if (!device.releaseYear) return 0
    return new Date().getFullYear() - device.releaseYear
  }

  /**
   * Checks if a device was released in the current year.
   */
  private static isCurrentYear(device: ClientDevice): boolean {
    if (!device.releaseYear) return false
    return device.releaseYear === new Date().getFullYear()
  }

  /**
   * Determines a human-readable category label based on device type and status.
   */
  private static getCategoryLabel(device: ClientDevice): string {
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
   */
  static enrichDevice(device: ClientDevice): ClientDeviceWithMetrics {
    return {
      ...device,
      ageInYears: this.computeAgeInYears(device),
      isCurrentYear: this.isCurrentYear(device),
      categoryLabel: this.getCategoryLabel(device)
    }
  }

  /**
   * Retrieves all devices from client-safe data store.
   */
  static getAllDevices(): ClientDevice[] {
    return Object.values(deviceData)
  }

  /**
   * Retrieves all devices with enriched metrics.
   */
  static getAllDevicesEnriched(): ClientDeviceWithMetrics[] {
    return this.getAllDevices().map((device) => this.enrichDevice(device))
  }

  /**
   * Retrieves a single device by its slug identifier.
   */
  static getDeviceBySlug(slug: string): ClientDeviceWithMetrics | null {
    const device = (deviceData as Record<string, ClientDevice>)[slug]
    return device ? this.enrichDevice(device) : null
  }

  /**
   * Filters devices based on multiple criteria.
   */
  static filterDevices(filters: {
    type?: DeviceType
    manufacturer?: string
    status?: string
    releaseYear?: number
  }): ClientDeviceWithMetrics[] {
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
   */
  static getDevicesByType(type: DeviceType): ClientDeviceWithMetrics[] {
    return this.filterDevices({ type })
  }

  /**
   * Retrieves all mobile devices from portfolio.
   */
  static getMobileDevices(): ClientDeviceWithMetrics[] {
    return this.getDevicesByType('mobile')
  }

  /**
   * Retrieves all digital audio players (DAPs) from portfolio.
   */
  static getDAPDevices(): ClientDeviceWithMetrics[] {
    return this.getDevicesByType('dap')
  }

  /**
   * Sorts devices by a specified property in ascending or descending order.
   */
  static sortDevices(
    devices: ClientDeviceWithMetrics[],
    sortBy: keyof ClientDeviceWithMetrics,
    order: SortOrder = 'asc'
  ): ClientDeviceWithMetrics[] {
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
   */
  static getRelatedDevices(device: ClientDevice): ClientDeviceWithMetrics[] {
    const sameType = this.filterDevices({ type: device.type }).filter(
      (d) => d.slug !== device.slug
    )

    const sameManufacturer = device.manufacturer
      ? this.filterDevices({ manufacturer: device.manufacturer }).filter(
          (d) => d.slug !== device.slug
        )
      : []

    const combined = new Map<string, ClientDeviceWithMetrics>()

    sameType.forEach((d) => combined.set(d.slug, d))
    sameManufacturer.forEach((d) => combined.set(d.slug, d))

    return Array.from(combined.values()).slice(0, 3)
  }
}
