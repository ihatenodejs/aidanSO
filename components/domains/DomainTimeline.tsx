import {
  getRenewalTimeline,
  formatDate,
  getNextRenewalDate
} from '@/lib/domains/utils'
import { Calendar, RefreshCw, Star } from 'lucide-react'
import type { DomainTimelineProps } from '@/lib/types'

export default function DomainTimeline({ domain }: DomainTimelineProps) {
  const timeline = getRenewalTimeline(domain)
  const nextRenewalDate = getNextRenewalDate(domain)

  return (
    <div className="rounded-lg border-2 border-gray-700 p-6 transition-colors duration-300 hover:border-gray-600">
      <div className="relative">
        <div className="absolute top-8 bottom-0 left-6 w-0.5 bg-gray-700"></div>

        <div className="space-y-8">
          {timeline.map((event, index) => {
            const isLatest = index === timeline.length - 1
            const isRegistration = event.type === 'registration'

            return (
              <div key={index} className="relative flex items-start gap-4">
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${
                    isRegistration || isLatest
                      ? 'border-2 border-slate-400/50 bg-gray-800'
                      : 'border-2 border-gray-700 bg-gray-800'
                  }`}
                >
                  {isRegistration ? (
                    <Star className="h-6 w-6 text-slate-300" />
                  ) : (
                    <RefreshCw
                      className={`h-5 w-5 ${isLatest ? 'text-slate-300' : 'text-gray-500'}`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <div
                    className={`rounded-lg border p-4 transition-colors ${
                      isRegistration || isLatest
                        ? 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600/50'
                        : 'border-slate-400/20 bg-slate-400/5 hover:border-slate-400/30'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          isRegistration || isLatest
                            ? 'text-slate-300'
                            : 'text-gray-400'
                        }`}
                      >
                        {isRegistration
                          ? 'Domain Registered'
                          : 'Domain Renewed'}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      {isRegistration ? (
                        <span>
                          Initial registration for {event.years}{' '}
                          {event.years === 1 ? 'year' : 'years'}
                        </span>
                      ) : (
                        <span>
                          Renewed for {event.years}{' '}
                          {event.years === 1 ? 'year' : 'years'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="relative flex items-start gap-4">
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-900">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="rounded-lg border border-dashed border-gray-700/50 bg-gray-900/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Next Renewal
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(nextRenewalDate)}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {domain.autoRenew
                    ? 'Auto-renewal enabled'
                    : 'Manual renewal required'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
