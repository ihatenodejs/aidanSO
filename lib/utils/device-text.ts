/**
 * Device text extraction utilities for generating dynamic content.
 *
 * Extracts OS version, root method, and link information from device
 * configuration data to inject into human-written text.
 *
 * @module lib/utils/device-text
 * @category Utils
 */

import type { DeviceSpec, DeviceSectionRow } from '@/lib/types'

/**
 * OS/ROM information extracted from device data.
 */
export interface OSInfo {
  /** Display name (e.g., 'Android 16', 'LineageOS 22.2') */
  name: string
  /** Version number (e.g., '16', '22.2') */
  version?: string
  /** Official documentation or download link */
  href?: string
}

/**
 * Root method information extracted from device data.
 */
export interface RootInfo {
  /** Root method name (e.g., 'KernelSU-Next', 'Magisk') */
  method: string
  /** GitHub or official link */
  href?: string
}

/**
 * Finds a row in device sections by label.
 *
 * @param device - Device specification
 * @param label - Row label to search for
 * @returns Matching row or undefined
 */
function findRow(
  device: DeviceSpec,
  label: string
): DeviceSectionRow | undefined {
  for (const section of device.sections) {
    if (section.rows) {
      const row = section.rows.find((r) => r.label === label)
      if (row) return row
    }
  }
  return undefined
}

/**
 * Extracts OS/ROM information from device data.
 *
 * Searches for rows with label "Android Version" or "ROM" and extracts
 * the display value, version number, and documentation link.
 *
 * @param device - Device specification
 * @returns OS information or null if not found
 *
 * @example
 * ```ts
 * const device = DeviceService.getDeviceBySlug('komodo')
 * const osInfo = getDeviceOSInfo(device)
 * // { name: 'Android 16', version: '16', href: 'https://...' }
 * ```
 */
export function getDeviceOSInfo(device: DeviceSpec | null): OSInfo | null {
  if (!device) return null

  const row = findRow(device, 'Android Version') || findRow(device, 'ROM')
  if (!row) return null

  return {
    name: row.value,
    version: row.filterValue,
    href: row.href
  }
}

/**
 * Extracts root method information from device data.
 *
 * Searches for rows with label "Root" and extracts the method name
 * and GitHub/official link.
 *
 * @param device - Device specification
 * @returns Root information or null if not found
 *
 * @example
 * ```ts
 * const device = DeviceService.getDeviceBySlug('cheetah')
 * const rootInfo = getDeviceRootInfo(device)
 * // { method: 'KernelSU-Next', href: 'https://github.com/...' }
 * ```
 */
export function getDeviceRootInfo(device: DeviceSpec | null): RootInfo | null {
  if (!device) return null

  const row = findRow(device, 'Root')
  if (!row) return null

  return {
    method: row.value,
    href: row.href
  }
}

/**
 * Generates human-readable OS text with optional link.
 *
 * Used for inline text generation in paragraphs.
 *
 * @param device - Device specification
 * @returns Formatted OS text (e.g., 'Android 16') or null
 *
 * @example
 * ```ts
 * const text = getOSText(device)
 * // 'Android 16'
 * ```
 */
export function getOSText(device: DeviceSpec | null): string | null {
  const osInfo = getDeviceOSInfo(device)
  return osInfo?.name || null
}

/**
 * Generates human-readable root method text.
 *
 * Used for inline text generation in paragraphs.
 *
 * @param device - Device specification
 * @returns Formatted root text (e.g., 'KernelSU-Next') or null
 *
 * @example
 * ```ts
 * const text = getRootText(device)
 * // 'KernelSU-Next'
 * ```
 */
export function getRootText(device: DeviceSpec | null): string | null {
  const rootInfo = getDeviceRootInfo(device)
  return rootInfo?.method || null
}
