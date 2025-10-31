'use client'

import * as React from 'react'

interface SeekBarProps {
  duration: string
  startPos: number
}

export function SeekBar({ duration, startPos }: SeekBarProps) {
  const getDurationInSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number)
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    } else {
      return parts[0] * 60 + parts[1]
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const totalSeconds = getDurationInSeconds(duration)
  const [currentSeconds] = React.useState(startPos)
  const progress = (currentSeconds / totalSeconds) * 100

  return (
    <div className="mx-auto w-full max-w-3xl pt-4">
      <div className="relative flex h-16 items-center">
        <div className="absolute -top-0.5 left-0 text-sm">
          {formatTime(currentSeconds)}
        </div>
        <div className="absolute -top-0.5 right-0 text-sm">{duration}</div>

        <div className="h-1 w-full rounded-full bg-gray-200">
          <div
            className="bg-primary h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white shadow-lg"
            style={{ left: `${progress}%`, marginLeft: '-6px' }}
          />
        </div>
      </div>
    </div>
  )
}
