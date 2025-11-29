import React from 'react'

/**
 * @public
 */
export interface NameIconProps {
  className?: string
}

export default function NameIcon({ className }: NameIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
    >
      <path d="m9.7 75v-47.1l13.5-3.3-2.1 15.2h1.5c.8-3.5 2.2-6.5 3.9-9 1.8-2.4 4.1-4.3 6.9-5.6 2.9-1.3 6.1-2 9.9-2 4.9 0 9.1 1.1 12.7 3.4 3.5 2.2 6.2 5.4 8.1 9.7 2 4.2 2.9 9.2 2.9 15v23.7h-13.4v-20.2c0-3.9-.6-7.2-1.8-9.9-1.2-2.8-2.9-4.9-5.2-6.3-2.3-1.5-5-2.2-8.2-2.2-4.8 0-8.5 1.6-11.2 4.8s-4 7.7-4 13.6v20.2z" />
      <circle cx="75" cy="68.5" r="5.7" />
    </svg>
  )
}
