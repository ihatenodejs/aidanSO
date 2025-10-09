import React from 'react'
import { SiGoogle } from 'react-icons/si'

interface GoogleIconProps {
  className?: string
  strokeWidth?: number
  size?: number
}

export default function GoogleIcon({ className, size }: GoogleIconProps) {
  return <SiGoogle className={className} size={size} />
}