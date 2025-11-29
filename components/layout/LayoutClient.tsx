'use client'

import { Header } from '../navigation'
import MobileMenuBlur from './MobileMenuBlur'
import { useMobileMenu } from './MobileMenuContext'

/**
 * @public
 */
export interface LayoutClientProps {
  children: React.ReactNode
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const { isOpen, setIsOpen } = useMobileMenu()

  return (
    <>
      <Header onMobileMenuChange={setIsOpen} />
      <MobileMenuBlur
        isBlurred={isOpen}
        className="relative flex min-h-0 w-full flex-1 flex-col"
      >
        {children}
      </MobileMenuBlur>
    </>
  )
}
