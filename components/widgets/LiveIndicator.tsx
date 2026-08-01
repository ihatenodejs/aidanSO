'use client'

const LiveIndicator = ({ isLive }: { isLive: boolean }) => {
  return (
    <div className="bg-opacity-50 flex items-center gap-1 rounded-full bg-black px-2 py-1">
      <div
        className={`h-1 w-1 rounded-full ${isLive ? 'animate-pulse bg-red-400' : 'bg-gray-400'}`}
      ></div>
      <div className="text-xs text-white">
        {isLive ? 'LIVE' : 'Connecting...'}
      </div>
    </div>
  )
}

export default LiveIndicator
