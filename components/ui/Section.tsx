import { ReactNode } from 'react'
import { cn, surfaces } from '@/lib/theme'

/**
 * @public
 */
export interface SectionProps {
  children: ReactNode
  variant?: keyof typeof surfaces.section
  className?: string
  id?: string
  title?: ReactNode
}

/**
 * Section component for content layout with consistent styling.
 *
 * @remarks
 * Provides a standardized section container with optional title and
 * configurable surface variants. Used throughout the application for
 * consistent content section styling and spacing.
 *
 * @param props - Section component properties
 * @param props.children - Section content
 * @param props.variant - Surface style variant (default, etc.)
 * @param props.className - Additional CSS classes
 * @param props.id - HTML id attribute
 * @param props.title - Optional section title displayed as h2
 * @returns Rendered section element
 *
 * @example
 * ```ts
 * <Section id="overview" title="Overview" variant="default">
 *   <p>Section content here</p>
 * </Section>
 * ```
 *
 * @category UI Components
 * @public
 */
export function Section({
  children,
  variant = 'default',
  className,
  id,
  title
}: SectionProps) {
  return (
    <section id={id} className={cn(surfaces.section[variant], className)}>
      {title && (
        <h2 className="mb-4 text-2xl font-semibold text-gray-200">{title}</h2>
      )}
      {children}
    </section>
  )
}
