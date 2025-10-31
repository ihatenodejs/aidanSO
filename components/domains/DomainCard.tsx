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
import { Calendar, Clock, ChevronRight, RefreshCw } from 'lucide-react'
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
      <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-gray-700 hover:shadow-xl hover:shadow-black/20">
        {expiringSoon && (
          <div className="absolute top-0 right-0 left-0 h-1 bg-gray-500"></div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className={`${statusVisual.color}`}>
                  <StatusIcon className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-semibold text-gray-100 transition-colors group-hover:text-white">
                  {domain.domain}
                </h3>
              </div>
              <p className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">
                {domain.usage}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-gray-400" />
          </div>

          <div className="mb-3 flex items-center gap-4 text-xs text-gray-400">
            <span
              className={`${categoryVisual.color} font-medium tracking-wide uppercase`}
            >
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

          <div className="mt-auto flex flex-col gap-2 border-t border-gray-800/50 pt-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-400">
                    {ownershipYears < 1
                      ? `${ownershipMonths}mo owned`
                      : `${ownershipYears}y owned`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  <span
                    className={
                      expiringSoon
                        ? 'font-medium text-gray-300'
                        : 'text-gray-400'
                    }
                  >
                    {expiringSoon
                      ? `${daysUntilExpiration}d left`
                      : formatDate(expirationDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
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
