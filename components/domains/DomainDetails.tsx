import {
  getRegistrationDate,
  getExpirationDate,
  getDaysUntilExpiration,
  getOwnershipDuration,
  getOwnershipMonths,
  formatDate,
  isExpiringSoon,
  getRenewalProgress,
  getOwnershipDays
} from '@/lib/domains/utils'
import { registrars } from '@/lib/config/registrars'
import { domainVisualConfig } from '@/lib/domains/config'
import {
  Shield,
  Tag,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Activity
} from 'lucide-react'
import type { DomainDetailsProps } from '@/lib/types'

export default function DomainDetails({ domain }: DomainDetailsProps) {
  const registrationDate = getRegistrationDate(domain)
  const expirationDate = getExpirationDate(domain)
  const daysUntilExpiration = getDaysUntilExpiration(domain)
  const ownershipYears = getOwnershipDuration(domain)
  const ownershipMonths = getOwnershipMonths(domain)
  const ownershipDays = getOwnershipDays(domain)
  const expiringSoon = isExpiringSoon(domain)
  const renewalProgress = getRenewalProgress(domain)
  const registrarConfig = registrars[domain.registrar]
  const statusVisual = domainVisualConfig.status[domain.status]
  const categoryVisual = domainVisualConfig.category[domain.category]
  const StatusIcon = statusVisual.icon
  const CategoryIcon = categoryVisual.icon

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">
              Status
            </p>
            <div
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${statusVisual.bg} ${statusVisual.border} border`}
            >
              <span className={statusVisual.color}>
                <StatusIcon className="h-5 w-5" />
              </span>
              <span className={`font-medium ${statusVisual.color}`}>
                {statusVisual.label}
              </span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">
              Category
            </p>
            <div
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${categoryVisual.bg} ${categoryVisual.border} border`}
            >
              <span className={categoryVisual.color}>
                <CategoryIcon className="h-5 w-5" />
              </span>
              <span className={`font-medium ${categoryVisual.color}`}>
                {categoryVisual.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">
            Domain Lifecycle
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            Owned for {ownershipDays} days (
            {ownershipYears < 1
              ? `${ownershipMonths} months`
              : `${ownershipYears} years`}
            )
          </div>
        </div>

        <div className="relative mb-4">
          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>Registered</span>
            <span>Expires</span>
          </div>
          <div className="relative h-4 overflow-hidden rounded-full bg-gray-800">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-slate-500 transition-all duration-500"
              style={{ width: `${renewalProgress}%` }}
            />
            {expiringSoon && (
              <div className="absolute top-0 right-0 h-full w-24 bg-gray-600/30" />
            )}
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-gray-400">
              {formatDate(registrationDate)}
            </span>
            <span
              className={`font-medium ${
                expiringSoon
                  ? 'text-gray-300'
                  : renewalProgress > 75
                    ? 'text-slate-400'
                    : 'text-gray-400'
              }`}
            >
              {formatDate(expirationDate)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-gray-800/50 p-2">
            <div className="text-lg font-bold text-slate-400">
              {Math.floor(renewalProgress)}%
            </div>
            <div className="text-xs text-gray-500">Period Used</div>
          </div>
          <div
            className={`rounded-lg p-2 ${expiringSoon ? 'bg-gray-800/70' : 'bg-gray-800/50'}`}
          >
            <div
              className={`text-lg font-bold ${expiringSoon ? 'text-gray-300' : 'text-slate-400'}`}
            >
              {daysUntilExpiration}
            </div>
            <div className="text-xs text-gray-500">Days Left</div>
          </div>
        </div>

        {expiringSoon && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-3">
            <AlertCircle className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Domain expires soon</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <p className="text-xs tracking-wide text-gray-500 uppercase">
                Registrar
              </p>
            </div>
            <div className="flex items-center gap-2">
              {registrarConfig && (
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 ${registrarConfig.color}`}
                >
                  <registrarConfig.icon className="h-4 w-4" />
                </div>
              )}
              <span className="font-medium text-gray-200">
                {domain.registrar}
              </span>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <p className="text-xs tracking-wide text-gray-500 uppercase">
                Auto-Renewal
              </p>
            </div>
            <button className="flex cursor-default items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2">
              {domain.autoRenew ? (
                <>
                  <ToggleRight className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-400">
                    Enabled
                  </span>
                </>
              ) : (
                <>
                  <ToggleLeft className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Disabled
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-300">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {domain.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-700/50 bg-gray-800/50 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
