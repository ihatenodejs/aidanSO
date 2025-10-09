import { ReactNode } from 'react'
import { cn, surfaces } from '@/lib/theme'

type CardVariant = keyof typeof surfaces.card
type SectionVariant = keyof typeof surfaces.section

interface CardProps {
  children: ReactNode
  title?: ReactNode
  variant?: CardVariant | SectionVariant
  className?: string
  spanCols?: number
  onClick?: () => void
}

/**
 * Versatile card component with optional title and column spanning.
 *
 * Supports both card and section variants from the theme system.
 * Can display an optional title (string or ReactNode with icons) and span multiple grid columns.
 *
 * @example
 * ```tsx
 * // Simple card
 * <Card variant="default">Content</Card>
 *
 * // Section card with title
 * <Card variant="default" title="My Section">Content</Card>
 *
 * // Card with icon in title
 * <Card title={<div className="flex items-center gap-2"><Icon />Title</div>}>
 *   Content
 * </Card>
 *
 * // Card spanning 2 columns
 * <Card spanCols={2}>Wide content</Card>
 * ```
 */
export function Card({
  children,
  title,
  variant = 'default',
  className,
  spanCols,
  onClick
}: CardProps) {
  let variantClass: string

  if (variant in surfaces.card) {
    variantClass = surfaces.card[variant as CardVariant]
  } else if (variant in surfaces.section) {
    variantClass = surfaces.section[variant as SectionVariant]
  } else {
    variantClass = surfaces.card.default
  }

  const colSpanClass = spanCols ? `lg:col-span-${spanCols}` : ''

  return (
    <div
      className={cn(variantClass, colSpanClass, className)}
      onClick={onClick}
    >
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}