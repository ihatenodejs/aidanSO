/**
 * Component helpers for device page TSX configuration
 *
 * These components are used to build device pages in a declarative way.
 * They don't render directly but are transformed into DeviceSpec data.
 */

import type { ReactNode } from 'react'
import type { DeviceIcon } from '@/lib/types'

export interface SectionProps {
  id: string
  title: string
  icon: DeviceIcon
  children: ReactNode
}

export interface RowProps {
  label: string
  value: string
  icon?: DeviceIcon
  href?: string
  note?: string
  filterValue?: string
}

export interface ModulesProps {
  id: string
  title: string
  icon: DeviceIcon
  children: ReactNode
}

export interface ModuleProps {
  label: string
  href?: string
  description?: string
}

export interface ParagraphsProps {
  id: string
  title: string
  icon: DeviceIcon
  rating?: {
    value: number
    scale?: number
    label?: string
  }
  children: ReactNode
}

export interface ParagraphProps {
  children: string
}

export function Section(props: SectionProps) {
  void props
  return null
}

export function Row(props: RowProps) {
  void props
  return null
}

export function Modules(props: ModulesProps) {
  void props
  return null
}

export function Module(props: ModuleProps) {
  void props
  return null
}

export function Paragraphs(props: ParagraphsProps) {
  void props
  return null
}

export function Paragraph(props: ParagraphProps) {
  void props
  return null
}
