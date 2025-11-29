'use client'

import { surfaces } from '@/lib/theme/surfaces'
import { cn } from '@/lib/utils'
import { Activity, Zap, TrendingUp, Clock } from 'lucide-react'

/**
 * @public
 */
export interface StatsGridProps {
  stats: {
    operational: number
    down: number
    total: number
  }
  avgResponseTime: number
}

export default function StatsGrid({ stats, avgResponseTime }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4">
      <div className={cn(surfaces.card.ai)}>
        <h3 className="mb-2 text-sm font-medium text-gray-400">Online</h3>
        <div className="flex items-center gap-3">
          <Activity className="text-gray-300" size={20} />
          <p className="text-3xl font-bold text-gray-100">
            {stats.operational}
          </p>
        </div>
      </div>

      <div className={cn(surfaces.card.ai)}>
        <h3 className="mb-2 text-sm font-medium text-gray-400">Offline</h3>
        <div className="flex items-center gap-3">
          <Zap className="text-gray-300" size={20} />
          <p className="text-3xl font-bold text-gray-100">{stats.down}</p>
        </div>
      </div>

      <div className={cn(surfaces.card.ai)}>
        <h3 className="mb-2 text-sm font-medium text-gray-400">
          Total Services
        </h3>
        <div className="flex items-center gap-3">
          <TrendingUp className="text-gray-300" size={20} />
          <p className="text-3xl font-bold text-gray-100">{stats.total}</p>
        </div>
      </div>

      <div className={cn(surfaces.card.ai)}>
        <h3 className="mb-2 text-sm font-medium text-gray-400">Avg Response</h3>
        <div className="flex items-center gap-3">
          <Clock className="text-gray-300" size={20} />
          <p className="text-3xl font-bold text-gray-100">
            {avgResponseTime}ms
          </p>
        </div>
      </div>
    </div>
  )
}
