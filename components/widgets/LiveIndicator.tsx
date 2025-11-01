'use client'

import { useEffect, useState } from 'react'
import { connectSocket } from '@/lib/socket'

const LiveIndicator = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = connectSocket()

    socket.on('connect', () => {
      setConnected(true)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return (
    <div className="bg-opacity-50 flex items-center gap-1 rounded-full bg-black px-2 py-1">
      <div
        className={`h-1 w-1 rounded-full ${connected ? 'animate-pulse bg-red-400' : 'bg-gray-400'}`}
      ></div>
      <div className="text-xs text-white">
        {connected ? 'LIVE' : 'Connecting...'}
      </div>
    </div>
  )
}

export default LiveIndicator
