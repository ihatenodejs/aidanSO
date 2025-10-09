import { default as NextLink } from 'next/link'
import { cn } from '@/lib/theme'
import { externalLinkProps } from '@/lib/utils/styles'

interface LinkProps {
  href: string
  className?: string
  target?: string
  rel?: string
  variant?: 'default' | 'nav' | 'muted'
  external?: boolean
  children: React.ReactNode
}

export default function Link({
  href,
  className,
  target,
  rel,
  variant = 'default',
  external,
  children
}: LinkProps) {
  const isExternal = external || href.startsWith('http')

  const variantStyles = {
    default: 'text-blue-400 hover:underline',
    nav: 'text-gray-300 hover:text-white',
    muted: 'text-gray-400 hover:text-gray-300'
  }

  return (
    <NextLink
      href={href}
      className={cn(variantStyles[variant], className)}
      target={target || (isExternal ? externalLinkProps.target : undefined)}
      rel={rel || (isExternal ? externalLinkProps.rel : undefined)}
    >
      {children}
    </NextLink>
  )
}