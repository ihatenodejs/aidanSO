/**
 * Device pages loader
 *
 * Imports all device page TSX configurations and transforms them into DeviceSpec data.
 */

import { transformDevicePage } from '../transformer'
import type { DeviceCollection } from '@/lib/types'

import * as komodo from './komodo'
import * as cheetah from './cheetah'
import * as bonito from './bonito'
import * as jm21 from './jm21'

/**
 * All device specifications transformed from TSX pages
 */
export const devices: DeviceCollection = {
  komodo: transformDevicePage(komodo),
  cheetah: transformDevicePage(cheetah),
  bonito: transformDevicePage(bonito),
  jm21: transformDevicePage(jm21)
}

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
  (device) => device.type === 'mobile'
)

/**
 * Get all DAP devices
 */
export const dapDevices = Object.values(devices).filter(
  (device) => device.type === 'dap'
)
