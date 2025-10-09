/**
 * Domain visual configuration for status and category badges, icons, and colors.
 *
 * @remarks
 * This module provides the centralized visual configuration for domain portfolio display,
 * including icons, colors, backgrounds, and borders for all domain statuses and categories.
 * All color values use Tailwind CSS classes for consistency with the theme system.
 *
 * @module lib/domains/config
 * @category Domains
 * @public
 */

import {
  CheckCircle,
  Archive,
  Construction,
  User,
  Briefcase,
  Rocket,
  PartyPopper,
  Package
} from 'lucide-react'
import type { DomainVisualConfig } from '@/lib/types'

/**
 * Visual configuration for domain status and category display.
 *
 * @remarks
 * Provides a complete mapping of domain statuses and categories to their visual representation.
 * Used throughout the domain portfolio for consistent badge styling, icons, and colors.
 *
 * **Configuration includes:**
 * - **status**: Visual config for active, parked, and reserved domains
 * - **category**: Visual config for personal, service, project, fun, and legacy domains
 *
 * Each configuration includes:
 * - `label`: Human-readable display text
 * - `icon`: Lucide React icon component
 * - `color`: Tailwind text color class
 * - `bg`: Tailwind background color class (semi-transparent)
 * - `border`: Tailwind border color class (semi-transparent)
 *
 * @example
 * ```tsx
 * import { domainVisualConfig } from '@/lib/domains/config'
 *
 * const DomainStatusBadge = ({ status }: { status: DomainStatus }) => {
 *   const config = domainVisualConfig.status[status]
 *   const Icon = config.icon
 *
 *   return (
 *     <span className={`${config.color} ${config.bg} ${config.border}`}>
 *       <Icon className="w-4 h-4" />
 *       {config.label}
 *     </span>
 *   )
 * }
 * ```
 *
 * @category Domains
 * @public
 */
export const domainVisualConfig: DomainVisualConfig = {
  status: {
    active: {
      label: 'Active',
      icon: CheckCircle,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20'
    },
    parked: {
      label: 'Parked',
      icon: Archive,
      color: 'text-gray-400',
      bg: 'bg-gray-600/10',
      border: 'border-gray-600/20'
    },
    reserved: {
      label: 'Reserved',
      icon: Construction,
      color: 'text-slate-400',
      bg: 'bg-slate-600/10',
      border: 'border-slate-600/20'
    }
  },
  category: {
    personal: {
      label: 'Personal',
      icon: User,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20'
    },
    service: {
      label: 'Service',
      icon: Briefcase,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20'
    },
    project: {
      label: 'Project',
      icon: Rocket,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20'
    },
    fun: {
      label: 'Fun',
      icon: PartyPopper,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20'
    },
    legacy: {
      label: 'Legacy',
      icon: Package,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20'
    }
  }
}

/**
 * Available sort options for domain list displays.
 *
 * @remarks
 * Provides a predefined list of sort options for domain portfolio UI components.
 * Each option includes a value (for logic) and label (for display).
 *
 * @example
 * ```tsx
 * import { sortOptions } from '@/lib/domains/config'
 *
 * const DomainSortSelect = () => (
 *   <select>
 *     {sortOptions.map(option => (
 *       <option key={option.value} value={option.value}>
 *         {option.label}
 *       </option>
 *     ))}
 *   </select>
 * )
 * ```
 *
 * @category Domains
 * @public
 */
export const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'expiration', label: 'Expiration Date' },
  { value: 'ownership', label: 'Ownership Duration' },
  { value: 'registrar', label: 'Registrar' }
] as const

/**
 * Days threshold for "expiring soon" warning indicators.
 *
 * @remarks
 * Domains expiring within this many days should display warning indicators.
 * Default is 30 days.
 *
 * @example
 * ```ts
 * import { expirationThreshold } from '@/lib/domains/config'
 * import { getDaysUntilExpiration } from '@/lib/domains/utils'
 *
 * const daysUntil = getDaysUntilExpiration(domain)
 * const isExpiringSoon = daysUntil <= expirationThreshold
 * ```
 *
 * @category Domains
 * @public
 */
export const expirationThreshold = 30 // days