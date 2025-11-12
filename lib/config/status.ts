import { colors } from '@/lib/theme'
import type { ServiceStatus, SystemHealth } from '@/lib/types/status'

/**
 * Metadata for system health status display and theming.
 * @category Status Configuration
 * @public
 */
export interface SystemHealthMeta {
  /** Human-readable label displayed in UI */
  label: string
  /** Short description for tooltips or summaries */
  description: string
  /** Hex or rgba color value for inline indicators */
  indicatorColor: string
  /** Tailwind utility class for indicator elements */
  indicatorClass: string
  /** Optional callout tone for cards/badges */
  tone: 'positive' | 'warning' | 'critical'
}

/**
 * Shared configuration describing overall system health states.
 *
 * @remarks
 * Centralises status labels and theming so the footer, status dashboard,
 * and API consumers stay in sync.
 */
export const SYSTEM_HEALTH_CONFIG: Record<SystemHealth, SystemHealthMeta> = {
  operational: {
    label: 'All Systems Operational',
    description:
      'All monitored services are reachable and responding normally.',
    indicatorColor: colors.accents.success,
    indicatorClass: 'bg-emerald-500',
    tone: 'positive'
  },
  partial_outage: {
    label: 'Partial Outage',
    description: 'One or more services are experiencing disruptions.',
    indicatorColor: colors.accents.warning,
    indicatorClass: 'bg-amber-400',
    tone: 'warning'
  },
  full_outage: {
    label: 'Full Outage',
    description: 'All monitored services are currently unavailable.',
    indicatorColor: colors.accents.error,
    indicatorClass: 'bg-red-500',
    tone: 'critical'
  }
} as const

/**
 * Convenience helper to read health metadata.
 */
export function getSystemHealthConfig(health: SystemHealth) {
  return SYSTEM_HEALTH_CONFIG[health]
}

/**
 * Metadata for individual service status display and theming.
 * @category Status Configuration
 * @public
 */
export interface ServiceStatusMeta {
  /** Short status label for service cards and summaries */
  label: string
  /** Low-opacity background tint for service cards */
  tint: string
  /** Text color for status labels */
  textColor: string
}

/**
 * Shared configuration describing individual service status states.
 */
export const SERVICE_STATUS_CONFIG: Record<ServiceStatus, ServiceStatusMeta> = {
  operational: {
    label: 'Up',
    tint: colors.accents.successBg,
    textColor: colors.accents.success
  },
  down: {
    label: 'Down',
    tint: colors.accents.errorBg,
    textColor: colors.accents.error
  },
  checking: {
    label: 'Checking',
    tint: colors.accents.warningBg,
    textColor: colors.accents.warning
  }
} as const

/**
 * Retrieves status configuration for a given service status.
 *
 * @remarks
 * Returns the visual configuration (colors, icons, labels) for displaying
 * service status indicators throughout the application. Used by status
 * components and service monitoring interfaces.
 *
 * @param status - The service status to get configuration for
 * @returns Status configuration object with colors, icon, and label
 *
 * @example
 * ```ts
 * const config = getServiceStatusConfig('healthy')
 * console.log(config.label) // 'Operational'
 * console.log(config.color) // green color value
 * ```
 *
 * @category Configuration
 * @public
 */
export function getServiceStatusConfig(status: ServiceStatus) {
  return SERVICE_STATUS_CONFIG[status]
}

/**
 * Visualization colors used across the status dashboard.
 */
export const STATUS_CHART_COLORS = {
  /** Browser measurement bar color */
  bar: colors.gray[500],
  /** Browser measurement bar hover color */
  barHover: colors.gray[400],
  /** Server measurement bar color */
  barServer: colors.gray[400],
  /** Server measurement bar hover color */
  barServerHover: colors.gray[300],
  /** Bar opacity for subtle appearance */
  barOpacity: 0.75,
  /** Grid line color */
  grid: colors.borders.subtle,
  /** Cursor highlight color */
  cursor: colors.borders.muted,
  /** Cursor opacity */
  cursorOpacity: 0.25
} as const
