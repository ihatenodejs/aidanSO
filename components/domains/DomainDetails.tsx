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
import { registrars } from '@/lib/domains/data'
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
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Status</p>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${statusVisual.bg} ${statusVisual.border} border`}>
              <span className={statusVisual.color}>
                <StatusIcon className="w-5 h-5" />
              </span>
              <span className={`font-medium ${statusVisual.color}`}>
                {statusVisual.label}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Category</p>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${categoryVisual.bg} ${categoryVisual.border} border`}>
              <span className={categoryVisual.color}>
                <CategoryIcon className="w-5 h-5" />
              </span>
              <span className={`font-medium ${categoryVisual.color}`}>
                {categoryVisual.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300">Domain Lifecycle</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            Owned for {ownershipDays} days ({ownershipYears < 1 ? `${ownershipMonths} months` : `${ownershipYears} years`})
          </div>
        </div>

        <div className="relative mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Registered</span>
            <span>Expires</span>
          </div>
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-slate-500 rounded-full transition-all duration-500"
              style={{ width: `${renewalProgress}%` }}
            />
            {expiringSoon && (
              <div className="absolute right-0 top-0 h-full w-24 bg-gray-600/30" />
            )}
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-gray-400">{formatDate(registrationDate)}</span>
            <span className={`font-medium ${
              expiringSoon ? 'text-gray-300' : renewalProgress > 75 ? 'text-slate-400' : 'text-gray-400'
            }`}>
              {formatDate(expirationDate)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-slate-400">{Math.floor(renewalProgress)}%</div>
            <div className="text-xs text-gray-500">Period Used</div>
          </div>
          <div className={`p-2 rounded-lg ${expiringSoon ? 'bg-gray-800/70' : 'bg-gray-800/50'}`}>
            <div className={`text-lg font-bold ${expiringSoon ? 'text-gray-300' : 'text-slate-400'}`}>
              {daysUntilExpiration}
            </div>
            <div className="text-xs text-gray-500">Days Left</div>
          </div>
        </div>

        {expiringSoon && (
          <div className="flex items-center gap-2 p-3 mt-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Domain expires soon
            </span>
          </div>
        )}
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-gray-500" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Registrar</p>
            </div>
            <div className="flex items-center gap-2">
              {registrarConfig && (
                <div className={`w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center ${registrarConfig.color}`}>
                  <registrarConfig.icon className="w-4 h-4" />
                </div>
              )}
              <span className="text-gray-200 font-medium">{domain.registrar}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-gray-500" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Auto-Renewal</p>
            </div>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 cursor-default">
              {domain.autoRenew ? (
                <>
                  <ToggleRight className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-400 font-medium">Enabled</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-500 font-medium">Disabled</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-300">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {domain.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-full text-sm hover:bg-gray-800 transition-colors border border-gray-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
