/**
 * Client-side device types for use in browser components
 * Uses string identifiers for icons instead of React components
 */

import type { DeviceSectionRating } from './device'

export interface ClientDeviceSection {
  id: string
  title: string
  icon?: string
  rows?: Array<{
    label: string
    value: string
    icon?: string
    href?: string
    note?: string
    filterValue?: string
  }>
  listItems?: Array<{
    label: string
    href: string
    description?: string
  }>
  paragraphs?: string[]
  rating?: DeviceSectionRating
}

export interface ClientDeviceSectionRow {
  label: string
  value: string
  icon?: string
  href?: string
  note?: string
  filterValue?: string
}

export interface ClientDevice {
  slug: string
  name: string
  shortName: string
  codename: string
  type: 'mobile' | 'dap'
  manufacturer: string
  status: string
  releaseYear: number
  heroImage: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  tagline: string
  summary: string[]
  stats: never[]
  sections: ClientDeviceSection[]
}

export interface ClientDeviceWithMetrics extends ClientDevice {
  ageInYears: number
  isCurrentYear: boolean
  categoryLabel: string
}

export interface ClientSectionCardProps {
  section: ClientDeviceSection
}

export interface ClientSectionRowProps {
  row: ClientDeviceSectionRow
}

export interface ClientDeviceCollection {
  [key: string]: ClientDevice
}
