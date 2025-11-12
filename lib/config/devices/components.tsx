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

/**
 * Stub component for device page sections (TypeScript type definitions only).
 *
 * @remarks
 * This is a build-time stub component used only for TypeScript type checking
 * during device data generation. The actual Section component is located at
 * components/ui/Section.tsx and should be used in runtime code.
 *
 * @param props - Section properties (unused in stub)
 * @returns Always returns null (stub implementation)
 *
 * @category Device Configuration
 * @internal
 */
export function Section(props: SectionProps) {
  void props
  return null
}

/**
 * Stub component for device page rows (TypeScript type definitions only).
 *
 * @remarks
 * This is a build-time stub component used only for TypeScript type checking
 * during device data generation. Should not be used in runtime components.
 *
 * @param props - Row properties (unused in stub)
 * @returns Always returns null (stub implementation)
 *
 * @category Device Configuration
 * @internal
 */
export function Row(props: RowProps) {
  void props
  return null
}

/**
 * Stub component for device module listings (TypeScript type definitions only).
 *
 * @remarks
 * This is a build-time stub component used only for TypeScript type checking
 * during device data generation. Should not be used in runtime components.
 *
 * @param props - Modules properties (unused in stub)
 * @returns Always returns null (stub implementation)
 *
 * @category Device Configuration
 * @internal
 */
export function Modules(props: ModulesProps) {
  void props
  return null
}

/**
 * Stub component for individual device modules (TypeScript type definitions only).
 *
 * @remarks
 * This is a build-time stub component used only for TypeScript type checking
 * during device data generation. Should not be used in runtime components.
 *
 * @param props - Module properties (unused in stub)
 * @returns Always returns null (stub implementation)
 *
 * @category Device Configuration
 * @internal
 */
export function Module(props: ModuleProps) {
  void props
  return null
}

/**
 * Stub component for multiple paragraphs (TypeScript type definitions only).
 *
 * @remarks
 * This is a build-time stub component used only for TypeScript type checking
 * during device data generation. Should not be used in runtime components.
 *
 * @param props - Paragraphs properties (unused in stub)
 * @returns Always returns null (stub implementation)
 *
 * @category Device Configuration
 * @internal
 */
export function Paragraphs(props: ParagraphsProps) {
  void props
  return null
}

/**
 * Stub component for single paragraphs (TypeScript type definitions only).
 *
 * @remarks
 * This is a build-time stub component used only for TypeScript type checking
 * during device data generation. Should not be used in runtime components.
 *
 * @param props - Paragraph properties (unused in stub)
 * @returns Always returns null (stub implementation)
 *
 * @category Device Configuration
 * @internal
 */
export function Paragraph(props: ParagraphProps) {
  void props
  return null
}
