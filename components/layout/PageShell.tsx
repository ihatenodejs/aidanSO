import { cn } from '@/lib/utils'

/**
 * @public
 */
export interface PageShellProps {
  children: React.ReactNode
  variant?: 'centered' | 'full-width'
  maxWidth?: '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  className?: string
  innerClassName?: string
}

/**
 * PageShell Component
 *
 * A standardized page layout component that provides consistent spacing and structure
 * across all pages in the application.
 *
 * @category Layout
 */
export default function PageShell({
  children,
  variant = 'full-width',
  maxWidth,
  className,
  innerClassName
}: PageShellProps) {
  const maxWidthClass = maxWidth ? `max-w-${maxWidth}` : ''

  if (variant === 'centered') {
    return (
      <div className={cn('container mx-auto grow px-4 py-12', className)}>
        {maxWidth ? (
          <div
            className={cn(maxWidthClass, 'mx-auto space-y-6', innerClassName)}
          >
            {children}
          </div>
        ) : (
          <div className={cn('space-y-6', innerClassName)}>{children}</div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('w-full space-y-6 pb-6', className)}>{children}</div>
  )
}
