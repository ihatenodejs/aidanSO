import React from 'react'
import { SiGoogle } from 'react-icons/si'

/**
 * @public
 */
export interface GoogleIconProps {
  size?: number
  className?: string
}

export default function GoogleIcon({ className, size }: GoogleIconProps) {
  return <SiGoogle className={className} size={size} />
}
