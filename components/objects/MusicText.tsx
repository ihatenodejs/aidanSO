'use client'

import type React from 'react'

/**
 * @public
 * @category Components
 */
export interface ScrollTxtProps {
  text: string
  className?: string
  type?: 'artist' | 'track' | 'release'
}

const ScrollTxt: React.FC<ScrollTxtProps> = ({
  text,
  className = '',
  type
}) => {
  const getTypeClass = (type?: string) => {
    switch (type) {
      case 'artist':
        return 'text-white text-xs opacity-90 font-medium text-[8px]'
      case 'track':
        return 'text-white text-xs font-bold'
      case 'release':
        return 'text-white text-xs opacity-90 font-medium text-[8px]'
      default:
        return ''
    }
  }

  const textClass = getTypeClass(type)

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="inline-block whitespace-nowrap">
        <span className={textClass}>{text}</span>
      </div>
    </div>
  )
}

export default ScrollTxt
