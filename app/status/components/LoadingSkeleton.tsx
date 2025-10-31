'use client'

import PageShell from '@/components/layout/PageShell'
import PageHeader from '@/components/objects/PageHeader'
import { Card } from '@/components/ui/Card'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  ChevronRight,
  Clock,
  Globe,
  Info,
  Loader2,
  Server
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { surfaces } from '@/lib/theme/surfaces'
import { projects } from '@/lib/config/projects'
import {
  getServiceStatusConfig,
  getSystemHealthConfig
} from '@/lib/config/status'
import { colors } from '@/lib/theme/colors'
import { getHealthColor, getHealthMessage } from '../utils'

const monitoredProjects = projects.filter((p) => p.serviceInfo.trackStatus)

type PlaceholderStat = {
  key: string
  label: string
  icon: LucideIcon
  value: {
    primary: string
    secondary?: string
  }
}

const placeholderStats: PlaceholderStat[] = [
  {
    key: 'online-total',
    label: 'Online/Total',
    icon: Activity,
    value: { primary: '00', secondary: '/00' }
  },
  {
    key: 'avg-response',
    label: 'Avg Response',
    icon: Clock,
    value: { primary: '000ms' }
  }
] as const

const placeholderServiceGroups = [
  {
    key: 'personal',
    title: 'Personal Services',
    icon: Globe,
    projects: monitoredProjects.filter((p) => p.serviceCategory === 'personal')
  },
  {
    key: 'project',
    title: 'Project Services',
    icon: Server,
    projects: monitoredProjects.filter((p) => p.serviceCategory === 'project')
  }
] as const

const checkingStatusConfig = getServiceStatusConfig('checking')
const operationalSystemConfig = getSystemHealthConfig('operational')

const categoryFilters = [
  { value: 'all', label: 'All Services', isActive: true },
  { value: 'personal', label: 'Personal', isActive: false },
  { value: 'project', label: 'Projects', isActive: false }
] as const

const statusFilters = [
  { value: 'all', label: 'All Status', isActive: true },
  {
    value: 'operational',
    label: getServiceStatusConfig('operational').label,
    isActive: false
  },
  {
    value: 'down',
    label: getServiceStatusConfig('down').label,
    isActive: false
  }
] as const

function SkeletonBar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'block h-full w-full animate-pulse overflow-hidden rounded bg-gray-700/40',
        className
      )}
    />
  )
}

function SkeletonText({
  text,
  className
}: {
  text: string
  className?: string
}) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="invisible">{text}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-pulse rounded bg-gray-700/40"
      />
    </span>
  )
}

export default function LoadingSkeleton() {
  return (
    <PageShell variant="full-width" className="space-y-4">
      <div className="my-12 text-center">
        <PageHeader
          icon={<Activity size={60} className="text-gray-300" />}
          title="Status"
        />
      </div>

      {/* Status Banner */}
      <div className="px-4">
        <div className="flex items-center justify-between rounded-lg border-2 border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div
              className="h-2.5 w-2.5 animate-pulse rounded-full"
              style={{ backgroundColor: getHealthColor('operational') }}
              aria-label={`Status: ${operationalSystemConfig.label}`}
            />
            <div className="text-lg font-semibold text-gray-100">
              <SkeletonText text={getHealthMessage('operational')} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock size={12} />
              <SkeletonText text="Last updated: 00s ago" />
            </div>
            <div className="text-[10px] text-gray-500">
              <SkeletonText text="00/00/0000, 00:00:00" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-2">
        {/* Metrics Overview */}
        <Card className="p-0">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {placeholderStats.map(({ key, label, icon: Icon, value }) => (
                <div key={key} className={cn(surfaces.card.ai, 'p-3 sm:p-4')}>
                  <h3 className="mb-1 text-xs font-medium text-gray-400 sm:mb-2 sm:text-sm">
                    {label}
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon className="flex-shrink-0 text-gray-300" size={16} />
                    <p className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-gray-100 sm:text-2xl md:text-3xl">
                        <SkeletonText text={value.primary} />
                      </span>
                      {value.secondary && (
                        <span className="text-base font-medium text-gray-500 sm:text-lg md:text-xl">
                          <SkeletonText text={value.secondary} />
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700/30 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-200 sm:text-2xl">
                    Response Times
                  </h2>
                  <Loader2
                    size={18}
                    className="animate-spin text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <button
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium tracking-wide uppercase',
                    'text-gray-500 ring-offset-gray-900',
                    'border border-transparent bg-transparent',
                    'opacity-60'
                  )}
                  disabled
                >
                  <Info size={14} />
                  <span>Limitations</span>
                </button>
              </div>
              <div className="relative h-[320px] w-full overflow-hidden rounded border border-dashed border-gray-700 bg-gray-800/40">
                <SkeletonBar />
              </div>
            </div>
          </div>
        </Card>

        {/* Service Monitor Skeleton */}
        <Card className="p-8">
          <div className="flex min-h-[28rem] flex-col gap-6">
            <div
              className="flex flex-wrap gap-3"
              role="toolbar"
              aria-label="Service filters"
            >
              <div
                className="flex gap-2"
                role="group"
                aria-label="Category filters"
              >
                {categoryFilters.map(({ value, label, isActive }) => (
                  <button
                    key={value}
                    className={cn(
                      'rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-300',
                      isActive
                        ? 'border-gray-700 bg-gray-800 text-white'
                        : 'border-transparent text-gray-400 opacity-60'
                    )}
                    disabled
                    aria-pressed={isActive}
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
                {statusFilters.map(({ value, label, isActive }) => (
                  <button
                    key={value}
                    className={cn(
                      'rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-300',
                      isActive
                        ? 'border-gray-700 bg-gray-800 text-white'
                        : 'border-transparent text-gray-400 opacity-60'
                    )}
                    disabled
                    aria-pressed={isActive}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-8">
              {placeholderServiceGroups.map(
                ({ key, title, icon: Icon, projects: groupProjects }) => (
                  <div key={key}>
                    <div className="mb-4 flex items-center gap-3">
                      <Icon size={24} className="text-gray-200" />
                      <h3 className="text-xl font-bold text-gray-200">
                        {title}
                      </h3>
                      <div className={cn(surfaces.badge.default, 'ml-auto')}>
                        {groupProjects.length}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {groupProjects.map((project) => {
                        const domainUsage =
                          project.domainInfo?.usage ??
                          'Domain usage details unavailable'

                        return (
                          <div
                            key={project.id}
                            className={cn(
                              surfaces.card.status,
                              'flex h-full flex-col gap-3 p-5'
                            )}
                            style={{
                              backgroundColor: checkingStatusConfig.tint
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 space-y-1">
                                <h4 className="truncate text-base font-semibold text-gray-100">
                                  <SkeletonText
                                    text={project.domain}
                                    className="w-full"
                                  />
                                </h4>
                                <p className="text-xs text-gray-500">
                                  <SkeletonText
                                    text={`https://${project.domain}`}
                                    className="w-full"
                                  />
                                </p>
                              </div>
                              <span
                                className="text-sm font-semibold"
                                style={{
                                  color: checkingStatusConfig.textColor
                                }}
                              >
                                <SkeletonText
                                  text={checkingStatusConfig.label}
                                />
                              </span>
                            </div>

                            <p className="mb-3 line-clamp-2 flex-grow text-xs text-gray-400">
                              <SkeletonText
                                text={domainUsage}
                                className="w-full"
                              />
                            </p>

                            <div
                              className="mt-auto border-t pt-2 text-[11px] text-gray-400"
                              style={{ borderColor: colors.borders.muted }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono">
                                    <SkeletonText text="000ms" />
                                  </span>
                                  <span
                                    className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-medium"
                                    style={{
                                      backgroundColor: colors.accents.warningBg,
                                      color: colors.accents.warning
                                    }}
                                  >
                                    <Clock size={10} />
                                    <SkeletonText text="Timeout" />
                                  </span>
                                </div>
                                <span
                                  className="flex items-center gap-1 text-xs font-medium"
                                  style={{ color: colors.accents.link }}
                                >
                                  <SkeletonText text="Info" />
                                  <ChevronRight
                                    size={11}
                                    className="text-gray-500"
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  )
}
