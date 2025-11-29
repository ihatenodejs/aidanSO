'use client'

import { useState, useMemo } from 'react'
import DomainCard from '@/components/domains/DomainCard'
import DomainFilters from '@/components/domains/DomainFilters'
import PageHeader from '@/components/objects/PageHeader'
import PageShell from '@/components/layout/PageShell'
import { Link, AlertCircle, Search, X } from 'lucide-react'
import { TbCurrencyDollarOff } from 'react-icons/tb'
import { DomainService } from '@/lib/services'
import {
  getDaysUntilExpiration,
  getOwnershipDuration,
  getOwnershipMonths
} from '@/lib/domains/utils'
import type {
  DomainCategory,
  DomainStatus,
  DomainRegistrarId,
  DomainSortOption
} from '@/lib/types'
import { surfaces } from '@/lib/theme/surfaces'
import { cn } from '@/lib/utils'
import { Formatter } from '@/lib/utils/formatting'
import { sortOptions } from '@/lib/domains/config'

const domains = DomainService.getAllDomains()

export default function Domains() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<
    DomainCategory[]
  >([])
  const [selectedStatuses, setSelectedStatuses] = useState<DomainStatus[]>([])
  const [selectedRegistrars, setSelectedRegistrars] = useState<
    DomainRegistrarId[]
  >([])
  const [sortBy, setSortBy] = useState<DomainSortOption>('name')

  const categories: DomainCategory[] = [
    'personal',
    'service',
    'project',
    'fun',
    'legacy'
  ]
  const statuses: DomainStatus[] = ['active', 'parked', 'reserved']

  const uniqueRegistrars = useMemo<DomainRegistrarId[]>(() => {
    return Array.from(new Set(domains.map((d) => d.registrar))).sort()
  }, [])

  const toggleCategory = (category: DomainCategory) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
  }

  const toggleStatus = (status: DomainStatus) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    setSelectedStatuses(updated)
  }

  const toggleRegistrar = (registrar: DomainRegistrarId) => {
    const updated = selectedRegistrars.includes(registrar)
      ? selectedRegistrars.filter((r) => r !== registrar)
      : [...selectedRegistrars, registrar]
    setSelectedRegistrars(updated)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedStatuses([])
    setSelectedRegistrars([])
    setSortBy('name')
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedRegistrars.length > 0

  const filteredAndSortedDomains = useMemo(() => {
    const filtered = domains.filter((domain) => {
      const matchesSearch =
        searchQuery === '' ||
        domain.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.usage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(domain.category)

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(domain.status)

      const matchesRegistrar =
        selectedRegistrars.length === 0 ||
        selectedRegistrars.includes(domain.registrar)

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesRegistrar
      )
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.domain.localeCompare(b.domain)
        case 'expiration':
          return getDaysUntilExpiration(a) - getDaysUntilExpiration(b)
        case 'ownership':
          return getOwnershipDuration(b) - getOwnershipDuration(a)
        case 'registrar':
          return a.registrar.localeCompare(b.registrar)
        default:
          return 0
      }
    })

    return filtered
  }, [
    searchQuery,
    selectedCategories,
    selectedStatuses,
    selectedRegistrars,
    sortBy
  ])

  const stats = useMemo(() => {
    const expiringSoon = domains.filter(
      (d) => getDaysUntilExpiration(d) <= 90
    ).length
    const totalDomains = domains.length
    const activeDomains = domains.filter((d) => d.status === 'active').length
    const avgOwnershipYears =
      domains.reduce((acc, d) => acc + getOwnershipDuration(d), 0) /
      domains.length
    const avgOwnershipMonths =
      domains.reduce((acc, d) => acc + getOwnershipMonths(d), 0) /
      domains.length

    return {
      expiringSoon,
      totalDomains,
      activeDomains,
      avgOwnershipYears,
      avgOwnershipMonths
    }
  }, [])

  return (
    <PageShell variant="centered" maxWidth="7xl">
      <div className="flex flex-col items-center text-center">
        <PageHeader icon={<Link size={60} />} title="My Domains" />
        <div className="flex flex-col items-center space-y-2 px-4 pt-10 pb-6 sm:pt-14 sm:pb-10">
          <TbCurrencyDollarOff size={26} className="text-gray-500" />
          <span className="mt-1 mb-0 text-center font-medium text-gray-400">
            These domains are not for sale.
          </span>
          <span className="text-center font-medium text-gray-400">
            All requests to buy them will be declined.
          </span>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 pb-6 sm:pb-14 md:grid-cols-4">
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {stats.totalDomains}
            </div>
            <div className="text-sm text-gray-500">Total Domains</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {stats.activeDomains}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-300">
              {stats.expiringSoon > 0 && (
                <AlertCircle className="h-6 w-6 text-orange-500" />
              )}
              {stats.expiringSoon}
            </div>
            <div className="text-sm text-gray-500">Expiring Soon</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-300">
              {stats.avgOwnershipYears < 1
                ? `${Math.round(stats.avgOwnershipMonths)} mo`
                : `${stats.avgOwnershipYears.toFixed(1)} yr`}
            </div>
            <div className="text-sm text-gray-500">Avg Time Owned</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-80 lg:shrink-0">
          <div className={cn('sticky top-8 p-6', surfaces.card.default)}>
            <h3 className="mb-4 text-lg font-semibold text-gray-200">
              Filters
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search domains..."
                className="w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 pr-4 pl-10 text-gray-200 placeholder-gray-500 focus:border-gray-700 focus:outline-none"
              />
            </div>

            {/* Sort */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs text-gray-500">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as DomainSortOption)}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-gray-200 focus:border-gray-700 focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mb-4 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400"
              >
                <X className="h-3 w-3" />
                Clear all filters
              </button>
            )}

            {/* Filter Options */}
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs text-gray-500">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        selectedCategories.includes(category)
                          ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {Formatter.capitalize(category)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs text-gray-500">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        selectedStatuses.includes(status)
                          ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {Formatter.capitalize(status)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs text-gray-500">Registrar</h4>
                <div className="flex flex-wrap gap-2">
                  {uniqueRegistrars.map((registrar) => (
                    <button
                      key={registrar}
                      onClick={() => toggleRegistrar(registrar)}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        selectedRegistrars.includes(registrar)
                          ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {registrar}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* Mobile Filters */}
          <div className="mb-4 lg:hidden">
            <DomainFilters
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategories}
              onStatusChange={setSelectedStatuses}
              onRegistrarChange={setSelectedRegistrars}
              onSortChange={setSortBy}
              registrars={uniqueRegistrars}
            />
          </div>

          {/* Domain Cards - Desktop */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedDomains.map((domain) => (
                <DomainCard key={domain.domain} domain={domain} />
              ))}
            </div>

            {filteredAndSortedDomains.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-400">No domains match your filters</p>
              </div>
            )}
          </div>

          {/* Domain Cards - Mobile */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 gap-4">
              {filteredAndSortedDomains.map((domain) => (
                <DomainCard key={domain.domain} domain={domain} />
              ))}
            </div>

            {filteredAndSortedDomains.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-400">No domains match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
