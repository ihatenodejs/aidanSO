'use client'

import { cn } from '@/lib/utils'
import { useMobileMenu } from './MobileMenuContext'

interface MobileMenuBlurProps {
  isBlurred?: boolean
  children: React.ReactNode
  className?: string
}

export default function MobileMenuBlur({
  isBlurred,
  children,
  className
}: MobileMenuBlurProps) {
  const { isOpen } = useMobileMenu()
  const shouldBlur = isBlurred !== undefined ? isBlurred : isOpen

  return (
    <div
      className={cn(
        'transition-all duration-300',
        shouldBlur &&
          'pointer-events-none blur-sm lg:pointer-events-auto lg:blur-none',
        className
      )}
    >
      {children}
    </div>
  )
}
