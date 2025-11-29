'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import type { SystemHealth } from '@/lib/types'
import { getHealthColor, getHealthMessage } from '../utils'

/**
 * @public
 */
export interface StatusOverviewProps {
  health: SystemHealth
  checkedAt: Date
  lastUpdated?: Date
}

export default function StatusOverview({
  health,
  checkedAt,
  lastUpdated
}: StatusOverviewProps) {
  const healthColor = getHealthColor(health)
  const displayTime = lastUpdated || checkedAt
  const [mounted, setMounted] = useState(false)
  const [timeAgoText, setTimeAgoText] = useState('Just now')

  useEffect(() => {
    const mountTimeout = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(mountTimeout)
  }, [])

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date()
      const secondsAgo = Math.floor(
        (now.getTime() - displayTime.getTime()) / 1000
      )

      if (secondsAgo < 10) {
        setTimeAgoText('Just now')
      } else if (secondsAgo < 60) {
        setTimeAgoText(`${secondsAgo}s ago`)
      } else {
        const minutesAgo = Math.floor(secondsAgo / 60)
        if (minutesAgo < 60) {
          setTimeAgoText(`${minutesAgo}m ago`)
        } else {
          const hoursAgo = Math.floor(minutesAgo / 60)
          setTimeAgoText(`${hoursAgo}h ago`)
        }
      }
    }

    updateTimeAgo()
    const intervalId = window.setInterval(updateTimeAgo, 1000)

    return () => window.clearInterval(intervalId)
  }, [displayTime])

  return (
    <div className="px-4">
      <div className="flex items-center justify-between rounded-lg border-2 border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: healthColor }}
            aria-label={`Status: ${getHealthMessage(health)}`}
          />
          <span className="text-lg font-semibold text-gray-100">
            {getHealthMessage(health)}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={12} />
            <span>Last updated: {timeAgoText}</span>
          </div>
          <div
            className="text-[10px] text-gray-500"
            aria-live="polite"
            aria-atomic="true"
          >
            {mounted ? displayTime.toLocaleString() : 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  )
}
