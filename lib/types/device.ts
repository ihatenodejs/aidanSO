/**
 * Device type definitions for portfolio showcase.
 *
 * Provides comprehensive type safety for device specifications, statistics,
 * sections, and UI components. Supports both mobile devices and DAPs (Digital Audio Players).
 *
 * @module lib/types/device
 * @category Types
 */

import React from 'react'

/**
 * Icon component type for device-related icons.
 *
 * @public
 */
export type DeviceIcon = React.ComponentType<{
  /** Optional className for styling */
  className?: string
  /** Optional size override */
  size?: number
}>

/**
 * Device type classification.
 *
 * @remarks
 * - `mobile`: Smartphones and mobile devices
 * - `dap`: Digital Audio Players (dedicated music players)
 *
 * @example
 * ```ts
 * const type: DeviceType = 'mobile'
 * ```
 *
 * @public
 */
export type DeviceType = 'mobile' | 'dap'

/**
 * Star rating display state.
 *
 * @remarks
 * Used for rendering star ratings with half-star support.
 *
 * @public
 */
export type StarState = 'full' | 'half' | 'empty'

/**
 * Type-safe external URL starting with http or https.
 *
 * @example
 * ```ts
 * const url: ExternalHref = 'https://example.com'
 * ```
 *
 * @public
 */
export type ExternalHref = `http${string}`

/**
 * Badge display configuration for device highlights.
 *
 * @example
 * ```ts
 * const badge: DeviceBadge = {
 *   label: 'Flagship',
 *   tone: 'highlight'
 * }
 * ```
 *
 * @public
 */
export interface DeviceBadge {
  /** Badge text */
  label: string

  /** Visual tone (default: neutral, highlight: accent, muted: subtle) */
  tone?: 'default' | 'highlight' | 'muted'
}

/**
 * Individual stat item within a stat group.
 *
 * @example
 * ```ts
 * const stat: DeviceStatItem = {
 *   label: 'Display',
 *   value: '6.1" OLED',
 *   href: 'https://example.com/display-specs'
 * }
 * ```
 *
 * @public
 */
export interface DeviceStatItem {
  /** Optional label for the stat */
  label?: string

  /** Stat value to display */
  value: string

  /** Optional external link for more information */
  href?: string
}

/**
 * Group of related device statistics.
 *
 * @example
 * ```tsx
 * import { CpuIcon } from 'lucide-react'
 *
 * const group: DeviceStatGroup = {
 *   title: 'Performance',
 *   icon: CpuIcon,
 *   accent: 'primary',
 *   items: [
 *     { label: 'Processor', value: 'Snapdragon 8 Gen 2' },
 *     { label: 'RAM', value: '8GB' },
 *     { label: 'Storage', value: '256GB' }
 *   ]
 * }
 * ```
 *
 * @public
 */
export interface DeviceStatGroup {
  /** Group title */
  title: string

  /** Optional icon for visual identification */
  icon?: DeviceIcon

  /** List of stat items in this group */
  items: DeviceStatItem[]

  /** Visual accent style */
  accent?: 'primary' | 'surface'
}

/**
 * Row item within a device section showing key-value pairs.
 *
 * @example
 * ```tsx
 * import { BatteryIcon } from 'lucide-react'
 *
 * const row: DeviceSectionRow = {
 *   label: 'Battery',
 *   value: '5000 mAh',
 *   icon: BatteryIcon,
 *   note: 'Supports 65W fast charging'
 * }
 * ```
 *
 * @public
 */
export interface DeviceSectionRow {
  /** Row label */
  label: string

  /** Row value */
  value: string

  /** Optional icon */
  icon?: DeviceIcon

  /** Optional external link */
  href?: string

  /** Optional additional note */
  note?: string
}

/**
 * List item within a device section.
 *
 * @example
 * ```ts
 * const item: DeviceSectionListItem = {
 *   label: 'USB-C 3.1',
 *   description: 'Fast data transfer and charging',
 *   href: 'https://example.com/usb-specs'
 * }
 * ```
 *
 * @public
 */
export interface DeviceSectionListItem {
  /** Item label */
  label: string

  /** Optional description */
  description?: string

  /** Optional external link */
  href?: string
}

/**
 * Rating configuration for device sections.
 *
 * @example
 * ```ts
 * const rating: DeviceSectionRating = {
 *   value: 4.5,
 *   scale: 5,
 *   label: 'Overall Rating'
 * }
 * ```
 *
 * @public
 */
export interface DeviceSectionRating {
  /** Rating value (supports half-stars) */
  value: number

  /** Maximum rating scale (default: 5) */
  scale?: number

  /** Optional rating label */
  label?: string
}

/**
 * Device section containing grouped information.
 *
 * @remarks
 * Sections can contain one of: rows (key-value pairs), listItems (bullet lists),
 * paragraphs (text content), or rating (star rating). Each section has an icon
 * for visual identification.
 *
 * @example
 * ```tsx
 * import { CameraIcon } from 'lucide-react'
 *
 * const section: DeviceSection = {
 *   id: 'camera',
 *   title: 'Camera',
 *   icon: CameraIcon,
 *   rows: [
 *     { label: 'Main', value: '50MP f/1.8' },
 *     { label: 'Ultra-wide', value: '12MP f/2.2' },
 *     { label: 'Telephoto', value: '10MP f/2.4' }
 *   ],
 *   rating: { value: 4.5, scale: 5 }
 * }
 * ```
 *
 * @public
 */
export interface DeviceSection {
  /** Unique section identifier */
  id: string

  /** Section title */
  title: string

  /** Section icon */
  icon: DeviceIcon

  /** Optional key-value rows */
  rows?: DeviceSectionRow[]

  /** Optional list items */
  listItems?: DeviceSectionListItem[]

  /** Optional text paragraphs */
  paragraphs?: string[]

  /** Optional rating */
  rating?: DeviceSectionRating
}

/**
 * Complete device specification.
 *
 * Contains all data needed to render a device page including metadata, statistics,
 * sections, and related devices.
 *
 * @example
 * ```tsx
 * import { CpuIcon, BatteryIcon } from 'lucide-react'
 *
 * const device: DeviceSpec = {
 *   slug: 'pixel-8-pro',
 *   name: 'Google Pixel 8 Pro',
 *   codename: 'husky',
 *   type: 'mobile',
 *   manufacturer: 'Google',
 *   shortName: 'Pixel 8 Pro',
 *   status: 'Current',
 *   releaseYear: 2023,
 *   heroImage: {
 *     src: '/img/devices/pixel-8-pro.png',
 *     alt: 'Google Pixel 8 Pro',
 *     width: 800,
 *     height: 600
 *   },
 *   tagline: 'AI-powered flagship smartphone',
 *   summary: [
 *     'Advanced Tensor G3 processor',
 *     'Exceptional camera system',
 *     'Premium build quality'
 *   ],
 *   badges: [
 *     { label: 'Flagship', tone: 'highlight' },
 *     { label: 'Current', tone: 'default' }
 *   ],
 *   stats: [
 *     {
 *       title: 'Performance',
 *       icon: CpuIcon,
 *       items: [
 *         { label: 'Processor', value: 'Google Tensor G3' },
 *         { label: 'RAM', value: '12GB' }
 *       ]
 *     }
 *   ],
 *   sections: [
 *     {
 *       id: 'battery',
 *       title: 'Battery',
 *       icon: BatteryIcon,
 *       rows: [{ label: 'Capacity', value: '5050 mAh' }]
 *     }
 *   ],
 *   related: ['pixel-7-pro', 'pixel-8'],
 *   updatedAt: '2024-01-15'
 * }
 * ```
 *
 * @public
 */
export interface DeviceSpec {
  /** URL-friendly slug */
  slug: string

  /** Full device name */
  name: string

  /** Optional device codename */
  codename?: string

  /** Device type (mobile or dap) */
  type: DeviceType

  /** Manufacturer name */
  manufacturer?: string

  /** Short display name */
  shortName?: string

  /** Current status (e.g., 'Current', 'Retired') */
  status?: string

  /** Year of release */
  releaseYear?: number

  /** Hero image configuration */
  heroImage: {
    /** Image source path */
    src: string
    /** Alt text for accessibility */
    alt: string
    /** Optional width */
    width?: number
    /** Optional height */
    height?: number
  }

  /** Marketing tagline */
  tagline?: string

  /** Summary bullet points */
  summary?: string[]

  /** Feature badges */
  badges?: DeviceBadge[]

  /** Stat groups */
  stats: DeviceStatGroup[]

  /** Content sections */
  sections: DeviceSection[]

  /** Related device slugs */
  related?: string[]

  /** Last update date (ISO format) */
  updatedAt?: string
}

/**
 * Collection of devices indexed by slug.
 *
 * @public
 */
export type DeviceCollection = Record<string, DeviceSpec>

/**
 * Enriched device with computed metrics.
 *
 * Extends {@link DeviceSpec} with age calculations and display labels.
 *
 * @remarks
 * This interface is generated by `DeviceService.enrichDevice()` method.
 * All devices returned by DeviceService methods include these computed properties.
 *
 * @example
 * ```ts
 * import { DeviceService } from '@/lib/services'
 *
 * const enriched: DeviceWithMetrics = DeviceService.enrichDevice(device)
 * console.log(enriched.ageInYears) // 1
 * console.log(enriched.isCurrentYear) // false
 * console.log(enriched.categoryLabel) // 'Mobile Devices'
 * ```
 *
 * @public
 */
export interface DeviceWithMetrics extends DeviceSpec {
  /** Device age in full years */
  ageInYears: number

  /** True if released in current year */
  isCurrentYear: boolean

  /** Display label for device category */
  categoryLabel: string
}

/**
 * Props for DevicePageShell component.
 *
 * @public
 */
export interface DevicePageShellProps {
  /** Device data to render */
  device: DeviceSpec
}

/**
 * Props for DeviceHero component.
 *
 * @public
 */
export interface DeviceHeroProps {
  /** Device data for hero section */
  device: DeviceSpec
}

/**
 * Props for StatsGrid component.
 *
 * @public
 */
export interface StatsGridProps {
  /** Stat groups to display */
  stats: DeviceStatGroup[]
}

/**
 * Props for StatItem component.
 *
 * @public
 */
export interface StatItemProps {
  /** Stat item to display */
  item: DeviceStatItem

  /** Optional group icon for fallback */
  groupIcon?: DeviceStatGroup['icon']
}

/**
 * Props for SectionsGrid component.
 *
 * @public
 */
export interface SectionsGridProps {
  /** Sections to display in grid */
  sections: DeviceSection[]
}

/**
 * Props for SectionCard component.
 *
 * @public
 */
export interface SectionCardProps {
  /** Section data to render */
  section: DeviceSection
}

/**
 * Props for SectionRow component.
 *
 * @public
 */
export interface SectionRowProps {
  /** Row data to render */
  row: NonNullable<DeviceSection['rows']>[number]
}

/**
 * Props for Rating component.
 *
 * @public
 */
export interface RatingProps {
  /** Rating data to render */
  rating: NonNullable<DeviceSection['rating']>
}