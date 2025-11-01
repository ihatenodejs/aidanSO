import { ReactNode } from 'react'
import { cn, surfaces } from '@/lib/theme'

interface SurfaceProps {
  children: ReactNode
  variant?: keyof typeof surfaces.panel
  className?: string
}

export function Surface({
  children,
  variant = 'dropdown',
  className
}: SurfaceProps) {
  return (
    <div className={cn(surfaces.panel[variant], className)}>{children}</div>
  )
}
