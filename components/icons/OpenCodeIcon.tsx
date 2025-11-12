import React from 'react'

/**
 * @public
 */
export interface OpenCodeIconProps {
  className?: string
}

export default function OpenCodeIcon({ className }: OpenCodeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 70 50"
      fill="currentColor"
      className={className}
      style={{ width: '1em', height: '1em' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.5 0H32.5V41.5955H0.5V0ZM24.5 8.5H8.5V33H24.5V8.5Z"
      />
      <path d="M37.5 0H61.5V8.5H45.5V33H61.5V41.5H37.5V0Z" />
    </svg>
  )
}
