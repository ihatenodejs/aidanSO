'use client'

import {
  getExpirationDate,
  getDaysUntilExpiration,
  getOwnershipDuration,
  getOwnershipMonths,
  isExpiringSoon,
  formatDate,
  getNextRenewalDate
} from '@/lib/domains/utils'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import type { DomainCardProps } from '@/lib/types'
import { domainVisualConfig } from '@/lib/domains/config'

export default function DomainCard({ domain }: DomainCardProps) {
  const expirationDate = getExpirationDate(domain)
  const nextRenewalDate = getNextRenewalDate(domain)
  const daysUntilExpiration = getDaysUntilExpiration(domain)
  const ownershipYears = getOwnershipDuration(domain)
  const ownershipMonths = getOwnershipMonths(domain)
  const expiringSoon = isExpiringSoon(domain)
  const statusVisual = domainVisualConfig.status[domain.status]
  const categoryVisual = domainVisualConfig.category[domain.category]
  const StatusIcon = statusVisual.icon

  return (
    <Link href={`/domains/${domain.domain}`}>
      <div className="group relative h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-black/20 cursor-pointer overflow-hidden flex flex-col">
        {expiringSoon && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-500"></div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`${statusVisual.color}`}>
                  <StatusIcon className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">
                  {domain.domain}
                </h3>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">{domain.usage}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-all group-hover:translate-x-1" />
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className={`${categoryVisual.color} font-medium uppercase tracking-wide`}>
              {categoryVisual.label}
            </span>
            <span className="text-gray-600">•</span>
            <span>{domain.registrar}</span>
            {domain.autoRenew && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-slate-500/80">Auto-renew</span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t border-gray-800/50 mt-auto">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400">
                    {ownershipYears < 1 ? `${ownershipMonths}mo owned` : `${ownershipYears}y owned`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span className={expiringSoon ? 'text-gray-300 font-medium' : 'text-gray-400'}>
                    {expiringSoon ? `${daysUntilExpiration}d left` : formatDate(expirationDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-400">
                Next renewal: {formatDate(nextRenewalDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
