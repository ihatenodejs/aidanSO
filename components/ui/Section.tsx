import { ReactNode } from 'react'
import { cn, surfaces } from '@/lib/theme'

interface SectionProps {
  children: ReactNode
  variant?: keyof typeof surfaces.section
  className?: string
  id?: string
  title?: ReactNode
}

export function Section({
  children,
  variant = 'default',
  className,
  id,
  title
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(surfaces.section[variant], className)}
    >
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}