import React from 'react'

interface OhMyPiIconProps {
  className?: string
  size?: number
}

export default function OhMyPiIcon({ className, size }: OhMyPiIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="8 12 48 46"
      width={size ?? 64}
      height={size ?? 64}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pi-mark-2-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.7 0.24 340)" />
          <stop offset=".5" stopColor="oklch(0.62 0.21 295)" />
          <stop offset="1" stopColor="oklch(0.81 0.14 200)" />
        </linearGradient>
      </defs>
      <path
        fill="url(#pi-mark-2-grad)"
        d="M10 14h44v9H43v33h-9V23h-9v22h-9V23H10z"
      />
    </svg>
  )
}
