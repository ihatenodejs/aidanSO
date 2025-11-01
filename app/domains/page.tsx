'use client'

import { useState, useMemo } from 'react'
import DomainCard from '@/components/domains/DomainCard'
import DomainFilters from '@/components/domains/DomainFilters'
import PageHeader from '@/components/objects/PageHeader'
import PageShell from '@/components/layout/PageShell'
import { Link, AlertCircle } from 'lucide-react'
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

  const uniqueRegistrars = useMemo<DomainRegistrarId[]>(() => {
    return Array.from(new Set(domains.map((d) => d.registrar))).sort()
  }, [])

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
        <PageHeader icon={<Link size={60} />} title="My Domain Portfolio" />
        <div className="flex flex-col items-center space-y-2 p-4 pt-8">
          <TbCurrencyDollarOff size={26} className="text-gray-500" />
          <span className="mt-1 mb-0 text-center font-medium text-gray-400">
            These domains are not for sale.
          </span>
          <span className="text-center font-medium text-gray-400">
            All requests to buy them will be declined.
          </span>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-gray-300">
              {stats.totalDomains}
            </div>
            <div className="text-sm text-gray-500">Total Domains</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-gray-300">
              {stats.activeDomains}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-300">
              {stats.expiringSoon > 0 && (
                <AlertCircle className="text-orange-500" />
              )}
              {stats.expiringSoon}
            </div>
            <div className="text-sm text-gray-500">Expiring Soon</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-300">
              {stats.avgOwnershipYears < 1
                ? `${Math.round(stats.avgOwnershipMonths)} mo`
                : `${stats.avgOwnershipYears.toFixed(1)} yr`}
            </div>
            <div className="text-sm text-gray-500">Avg Time Owned</div>
          </div>
        </div>
      </div>

      <DomainFilters
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategories}
        onStatusChange={setSelectedStatuses}
        onRegistrarChange={setSelectedRegistrars}
        onSortChange={setSortBy}
        registrars={uniqueRegistrars}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedDomains.map((domain) => (
          <DomainCard key={domain.domain} domain={domain} />
        ))}
      </div>

      {filteredAndSortedDomains.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No domains match your filters</p>
        </div>
      )}
    </PageShell>
  )
}
