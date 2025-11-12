import { cn, surfaces } from '@/lib/theme'

type CardVariant = keyof typeof surfaces.card
type SectionVariant = keyof typeof surfaces.section

/**
 * @public
 */
export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'domain' | 'ai' | 'featured' | 'simple' | 'status'
  hover?: boolean
  className?: string
  title?: React.ReactNode
  spanCols?: number
  onClick?: () => void
  id?: string
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
  onClick,
  id
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
      id={id}
      className={cn(variantClass, colSpanClass, className)}
      onClick={onClick}
    >
      {title && (
        <h2 className="mb-4 text-2xl font-semibold text-gray-200">{title}</h2>
      )}
      {children}
    </div>
  )
}
