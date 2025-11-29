import { ReactNode } from 'react'
import { cn, surfaces } from '@/lib/theme'

/**
 * @public
 */
export interface SurfaceProps {
  children: ReactNode
  variant?: keyof typeof surfaces.panel
  className?: string
}

/**
 * Surface component for consistent panel styling.
 *
 * @remarks
 * Provides a flexible surface container with multiple style variants
 * for dropdowns, modals, cards, and other UI panels. Integrates with
 * the theme system for consistent visual design.
 *
 * @param props - Surface component properties
 * @param props.children - Content to render inside the surface
 * @param props.variant - Surface style variant (dropdown, modal, etc.)
 * @param props.className - Additional CSS classes
 * @returns Rendered surface div with theme styling
 *
 * @example
 * ```ts
 * <Surface variant="dropdown">
 *   <p>Dropdown content</p>
 * </Surface>
 * ```
 *
 * @category UI Components
 * @public
 */
export function Surface({
  children,
  variant = 'dropdown',
  className
}: SurfaceProps) {
  return (
    <div className={cn(surfaces.panel[variant], className)}>{children}</div>
  )
}
