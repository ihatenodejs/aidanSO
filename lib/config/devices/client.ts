/**
 * Client-safe device data
 * This module imports the pre-built JSON data and is safe for client-side use
 */

import builtDevices from './built-devices-client.json'
import type {
  ClientDevice,
  ClientDeviceCollection
} from '@/lib/types/client-device'

/**
 * All device specifications (client-safe)
 */
export const devices: ClientDeviceCollection =
  builtDevices as unknown as ClientDeviceCollection

/**
 * Array of all device slugs
 */
export const deviceSlugs = Object.keys(devices)

/**
 * Get device by slug
 */
export function getDeviceBySlug(slug: string) {
  return devices[slug]
}

/**
 * Get all mobile devices
 */
export const mobileDevices = Object.values(devices).filter(
  (device: ClientDevice) => device.type === 'mobile'
)

/**
 * Get all DAP devices
 */
export const dapDevices = Object.values(devices).filter(
  (device: ClientDevice) => device.type === 'dap'
)
