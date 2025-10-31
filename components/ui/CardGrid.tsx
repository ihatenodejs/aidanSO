import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardGridProps {
  children: ReactNode
  cols?: '2' | '3' | '4'
  className?: string
}

/**
 * Responsive card grid layout component.
 *
 * Provides a consistent grid system for card layouts with mobile-first responsive breakpoints.
 * Default is 3 columns (1 on mobile, 2 on tablet, 3 on desktop).
 *
 * @example
 * ```tsx
 * <CardGrid cols="3">
 *   <Card>Card 1</Card>
 *   <Card>Card 2</Card>
 *   <Card>Card 3</Card>
 * </CardGrid>
 * ```
 */
export function CardGrid({ children, cols = '3', className }: CardGridProps) {
  const gridClasses = {
    '2': 'grid grid-cols-1 md:grid-cols-2 gap-4 p-4',
    '3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4',
    '4': 'grid grid-cols-2 md:grid-cols-4 gap-4'
  }

  return <div className={cn(gridClasses[cols], className)}>{children}</div>
}
