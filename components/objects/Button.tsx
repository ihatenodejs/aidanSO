import React from 'react'
import Link from 'next/link'

interface ButtonProps {
  href: string
  target?: string
  variant?: 'primary' | 'rounded'
  className?: string
  icon?: React.ReactNode
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  href,
  target,
  variant,
  className,
  icon,
  children
}) => {
  if (!variant || variant === 'primary') {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 rounded-sm bg-gray-800 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-gray-700 hover:shadow-lg focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-hidden ${className}`}
        target={target}
      >
        {icon}
        {children}
      </Link>
    )
  } else if (variant === 'rounded') {
    return (
      <Link
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-gray-700 px-4 py-2 whitespace-nowrap text-white transition-colors hover:bg-gray-600 ${className}`}
      >
        {icon}
        {children}
      </Link>
    )
  }
}

export default Button
