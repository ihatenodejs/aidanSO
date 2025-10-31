/**
 * Device configuration constants and display labels.
 *
 * @remarks
 * This module provides configuration constants used throughout the device showcase
 * for consistent labeling and sizing of UI elements.
 *
 * @module lib/devices/config
 * @category Devices
 * @public
 */

/**
 * Human-readable labels for device types.
 *
 * @remarks
 * Maps device type identifiers to their display labels for use in UI components.
 *
 * @example
 * ```tsx
 * import { deviceTypeLabels } from '@/lib/devices/config'
 *
 * const DeviceTypeBadge = ({ type }: { type: keyof typeof deviceTypeLabels }) => (
 *   <span>{deviceTypeLabels[type]}</span>
 * )
 * ```
 *
 * @category Devices
 * @public
 */
export const deviceTypeLabels = {
  /** Label for mobile phone devices */
  mobile: 'Mobile device',
  /** Label for digital audio player devices */
  dap: 'Digital audio player'
} as const

/**
 * Standard icon sizes for device components.
 *
 * @remarks
 * Provides consistent icon sizing across device stat displays and section headers.
 * All sizes are in pixels.
 *
 * @example
 * ```tsx
 * import { iconSizes } from '@/lib/devices/config'
 * import { Smartphone } from 'lucide-react'
 *
 * <Smartphone size={iconSizes.stat} />
 * ```
 *
 * @category Devices
 * @public
 */
export const iconSizes = {
  /** Icon size for device stat displays (60px) */
  stat: 60,
  /** Icon size for device section headers (60px) */
  section: 60
} as const
