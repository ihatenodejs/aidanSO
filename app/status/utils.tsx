/**
 * Status dashboard utilities and helper functions.
 *
 * @remarks
 * Provides shared utilities for rendering status indicators and health messages
 * across all status dashboard components. Ensures consistent theming and behavior.
 *
 * @example
 * ```tsx
 * import { getStatusIcon, getHealthColor } from './utils'
 *
 * // Render status icon
 * <div>{getStatusIcon('operational')}</div>
 *
 * // Use health color
 * <div style={{ backgroundColor: getHealthColor('operational') }} />
 * ```
 *
 * @module app/status/utils
 */

import { getSystemHealthConfig } from '@/lib/config/status'
import { colors } from '@/lib/theme'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import type { ServiceStatus, SystemHealth } from '@/lib/types'

/**
 * Get themed status icon component.
 *
 * @example
 * ```tsx
 * {getStatusIcon('operational')}      // Green checkmark
 * {getStatusIcon('down', 24)}         // Red X, size 24
 * ```
 */
export function getStatusIcon(status: ServiceStatus, size = 18) {
  const props = { className: 'flex-shrink-0', size }

  switch (status) {
    case 'operational':
      return (
        <CheckCircle {...props} style={{ color: colors.accents.success }} />
      )
    case 'down':
      return <XCircle {...props} style={{ color: colors.accents.error }} />
    case 'checking':
      return <Clock {...props} style={{ color: colors.accents.warning }} />
  }
}

/**
 * Get themed color for health status.
 *
 * @example
 * ```tsx
 * <div style={{ backgroundColor: getHealthColor('operational') }} />
 * ```
 */
export function getHealthColor(health: SystemHealth) {
  return getSystemHealthConfig(health).indicatorColor
}

/**
 * Get human-readable health message.
 *
 * @example
 * ```tsx
 * getHealthMessage('operational')  // "All Systems Operational"
 * ```
 */
export function getHealthMessage(health: SystemHealth) {
  return getSystemHealthConfig(health).label
}
