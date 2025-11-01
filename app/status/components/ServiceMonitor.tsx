'use client'

import { useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { surfaces, cn, colors } from '@/lib/theme'
import {
  AlertCircle,
  ChevronRight,
  Globe,
  Link2Off,
  Server,
  WifiOff,
  Clock,
  ServerCrash
} from 'lucide-react'
import Link from 'next/link'
import type { ServiceStatus, ServiceStatusResult, ErrorType } from '@/lib/types'
import { projects } from '@/lib/config/projects'
import { getServiceStatusConfig } from '@/lib/config/status'

/**
 * Check if a domain exists in the projects configuration.
 */
function getDomainInfo(domainName: string): { exists: boolean } {
  const exists = projects.some((project) => project.domain === domainName)
  return { exists }
}

const ERROR_TYPE_CONFIG = {
  network: {
    label: 'Network Error',
    icon: WifiOff,
    color: colors.accents.error,
    bgColor: colors.accents.errorBg
  },
  timeout: {
    label: 'Timeout',
    icon: Clock,
    color: colors.accents.warning,
    bgColor: colors.accents.warningBg
  },
  server: {
    label: 'Server Error',
    icon: ServerCrash,
    color: colors.accents.error,
    bgColor: colors.accents.errorBg
  },
  cors: {
    label: 'CORS Error',
    icon: AlertCircle,
    color: colors.accents.warning,
    bgColor: colors.accents.warningBg
  },
  unknown: {
    label: 'Error',
    icon: AlertCircle,
    color: colors.accents.error,
    bgColor: colors.accents.errorBg
  }
} as const

function getErrorTypeConfig(errorType: ErrorType | null | undefined) {
  if (!errorType) return ERROR_TYPE_CONFIG.unknown
  return ERROR_TYPE_CONFIG[errorType] || ERROR_TYPE_CONFIG.unknown
}

type CategoryFilter = 'all' | 'personal' | 'project'
type StatusFilter = 'all' | Exclude<ServiceStatus, 'checking'>

const CATEGORY_FILTERS: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: 'All Services' },
  { value: 'personal', label: 'Personal' },
  { value: 'project', label: 'Projects' }
]

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All Status' },
  { value: 'operational', label: getServiceStatusConfig('operational').label },
  { value: 'down', label: getServiceStatusConfig('down').label }
]

interface ServiceMonitorProps {
  services: ServiceStatusResult[]
}

export default function ServiceMonitor({ services }: ServiceMonitorProps) {
  const [filter, setFilter] = useState<CategoryFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredServices = services.filter((serviceResult) => {
    const matchesCategory =
      filter === 'all' || serviceResult.project.serviceCategory === filter
    const matchesStatus =
      statusFilter === 'all' || serviceResult.status === statusFilter
    return matchesCategory && matchesStatus
  })

  const personalServices = filteredServices.filter(
    (service) => service.project.serviceCategory === 'personal'
  )
  const projectServices = filteredServices.filter(
    (service) => service.project.serviceCategory === 'project'
  )

  const serviceGroups = [
    {
      key: 'personal',
      title: 'Personal Services',
      icon: Globe,
      services: personalServices,
      isVisible: filter === 'all' || filter === 'personal'
    },
    {
      key: 'project',
      title: 'Project Services',
      icon: Server,
      services: projectServices,
      isVisible: filter === 'all' || filter === 'project'
    }
  ] as const
  const visibleGroups = serviceGroups.filter((group) => group.isVisible)
  const groupsWithServices = visibleGroups.filter(
    (group) => group.services.length > 0
  )
  const showEmptyState = groupsWithServices.length === 0
  const activeCategoryLabel =
    CATEGORY_FILTERS.find(({ value }) => value === filter)?.label ??
    CATEGORY_FILTERS[0]!.label
  const activeStatusLabel =
    statusFilter === 'all'
      ? STATUS_FILTERS[0]!.label
      : getServiceStatusConfig(statusFilter).label
  const activeFilterLabels = [
    filter !== 'all' ? activeCategoryLabel : undefined,
    statusFilter !== 'all' ? activeStatusLabel : undefined
  ].filter(Boolean)

  const getToggleClasses = (isActive: boolean) =>
    cn(
      'rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-300',
      isActive
        ? 'border-gray-700 bg-gray-800 text-white'
        : 'border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-300'
    )

  const handleLinkMouseEnter = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.color = colors.accents.linkHover
  }

  const handleLinkMouseLeave = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.color = colors.accents.link
  }

  const renderServiceCard = (result: ServiceStatusResult) => {
    const statusConfig = getServiceStatusConfig(result.status)
    const domainInfo = getDomainInfo(result.project.domain)
    const errorTypeConfig = result.errorType
      ? getErrorTypeConfig(result.errorType)
      : null
    const domainUsage =
      result.project.domainInfo?.usage ??
      'Status details are unavailable for this domain.'

    if (result.status === 'checking' && statusFilter === 'all') {
      return (
        <div
          key={result.project.id}
          className={cn(surfaces.card.status, 'flex h-full flex-col p-5')}
          style={{ backgroundColor: statusConfig.tint }}
          aria-busy="true"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate text-base font-semibold text-gray-100">
                <span className="relative inline-block">
                  <span className="invisible">{result.project.domain}</span>
                  <span className="absolute inset-0 animate-pulse rounded bg-gray-700/40" />
                </span>
              </h4>
              <p className="text-xs text-gray-500">
                <span className="relative inline-block">
                  <span className="invisible">{`https://${result.project.domain}`}</span>
                  <span className="absolute inset-0 animate-pulse rounded bg-gray-700/40" />
                </span>
              </p>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: statusConfig.textColor }}
            >
              <span className="relative inline-block">
                <span className="invisible">Checking</span>
                <span className="absolute inset-0 animate-pulse rounded bg-gray-700/40" />
              </span>
            </span>
          </div>

          <p className="mb-3 line-clamp-2 grow text-xs text-gray-400">
            <span className="relative inline-block w-full">
              <span className="invisible">{domainUsage}</span>
              <span className="absolute inset-0 animate-pulse rounded bg-gray-700/40" />
            </span>
          </p>

          <div
            className="mt-auto border-t pt-2 text-[11px] text-gray-400"
            style={{ borderColor: colors.borders.muted }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono">
                  <span className="relative inline-block">
                    <span className="invisible">000ms</span>
                    <span className="absolute inset-0 animate-pulse rounded bg-gray-700/40" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        key={result.project.id}
        className={cn(surfaces.card.status, 'flex h-full flex-col p-5')}
        style={{ backgroundColor: statusConfig.tint }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate text-base font-semibold text-gray-100">
              {result.project.domain}
            </h4>
            <p className="text-xs text-gray-500">{`https://${result.project.domain}`}</p>
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: statusConfig.textColor }}
          >
            {statusConfig.label}
          </span>
        </div>

        <p className="mb-3 line-clamp-2 grow text-xs text-gray-400">
          {domainUsage}
        </p>

        <div
          className="mt-auto border-t pt-2 text-[11px] text-gray-400"
          style={{ borderColor: colors.borders.muted }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {result.responseTime !== null && (
                <span className="font-mono">
                  {result.responseTime}
                  ms
                </span>
              )}
              {errorTypeConfig && (
                <div
                  className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-medium"
                  style={{
                    backgroundColor: errorTypeConfig.bgColor,
                    color: errorTypeConfig.color
                  }}
                >
                  {(() => {
                    const ErrorIcon = errorTypeConfig.icon
                    return <ErrorIcon size={10} />
                  })()}
                  <span>{errorTypeConfig.label}</span>
                </div>
              )}
            </div>
            {domainInfo.exists && (
              <Link
                href={`/domains/${result.project.domain}`}
                className="flex items-center gap-1 text-xs font-medium transition-colors duration-300"
                style={{ color: colors.accents.link }}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                <span>Info</span>
                <ChevronRight size={11} />
              </Link>
            )}
          </div>

          {!result.errorType && result.error && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className="truncate text-[11px]"
                style={{ color: colors.accents.error }}
              >
                {result.error}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-112 flex-col gap-6">
      <div
        className="flex flex-wrap gap-3"
        role="toolbar"
        aria-label="Service filters"
      >
        <div className="flex gap-2" role="group" aria-label="Category filters">
          {CATEGORY_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={getToggleClasses(filter === value)}
              aria-pressed={filter === value}
              aria-label={`Filter by ${label}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="ml-auto flex gap-2"
          role="group"
          aria-label="Status filters"
        >
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={getToggleClasses(statusFilter === value)}
              aria-pressed={statusFilter === value}
              aria-label={`Filter by ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {showEmptyState ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-gray-700/70 bg-gray-900/40 p-10 text-center">
          <Link2Off size={28} className="mb-3 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-100">
            No services match these filters
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {activeFilterLabels.length > 0
              ? 'Try tweaking your filters to see more results.'
              : 'Try switching to a different category or status to see more services.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-8">
          {groupsWithServices.map((group) => {
            const Icon = group.icon

            return (
              <div key={group.key}>
                <div className="mb-4 flex items-center gap-3">
                  <Icon size={24} className="text-gray-200" />
                  <h3 className="text-xl font-bold text-gray-200">
                    {group.title}
                  </h3>
                  <div className={cn(surfaces.badge.default, 'ml-auto')}>
                    {group.services.length}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {group.services.map(renderServiceCard)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
