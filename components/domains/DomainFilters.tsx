'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import type {
  DomainFiltersProps,
  DomainCategory,
  DomainStatus,
  DomainRegistrarId,
  DomainSortOption
} from '@/lib/types'
import { sortOptions } from '@/lib/domains/config'

export default function DomainFilters({
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onRegistrarChange,
  onSortChange,
  registrars
}: DomainFiltersProps) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<
    DomainCategory[]
  >([])
  const [selectedStatuses, setSelectedStatuses] = useState<DomainStatus[]>([])
  const [selectedRegistrars, setSelectedRegistrars] = useState<
    DomainRegistrarId[]
  >([])
  const [sortBy, setSortBy] = useState<DomainSortOption>('name')
  const [showFilters, setShowFilters] = useState(false)

  const categories: DomainCategory[] = [
    'personal',
    'service',
    'project',
    'fun',
    'legacy'
  ]
  const statuses: DomainStatus[] = ['active', 'parked', 'reserved']

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  const toggleCategory = (category: DomainCategory) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    onCategoryChange(updated)
  }

  const toggleStatus = (status: DomainStatus) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    setSelectedStatuses(updated)
    onStatusChange(updated)
  }

  const toggleRegistrar = (registrar: DomainRegistrarId) => {
    const updated = selectedRegistrars.includes(registrar)
      ? selectedRegistrars.filter((r) => r !== registrar)
      : [...selectedRegistrars, registrar]
    setSelectedRegistrars(updated)
    onRegistrarChange(updated)
  }

  const handleSortChange = (value: DomainSortOption) => {
    setSortBy(value)
    onSortChange(value)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setSelectedStatuses([])
    setSelectedRegistrars([])
    setSortBy('name')
    onSearchChange('')
    onCategoryChange([])
    onStatusChange([])
    onRegistrarChange([])
    onSortChange('name')
  }

  const hasActiveFilters =
    search ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedRegistrars.length > 0

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search domains..."
            className="w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 pr-4 pl-10 text-gray-200 placeholder-gray-500 focus:border-gray-700 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
            showFilters || hasActiveFilters
              ? 'border-gray-700 bg-gray-800 text-white'
              : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700 hover:text-gray-300'
          }`}
        >
          <Filter className="h-5 w-5" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-slate-500/20 px-2 py-0.5 text-xs text-slate-400">
              Active
            </span>
          )}
        </button>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as DomainSortOption)}
          className="rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-2 text-gray-200 focus:border-gray-700 focus:outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {showFilters && (
        <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900/30 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">
              Filter Options
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

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
                  {category}
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
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs text-gray-500">Registrar</h4>
            <div className="flex flex-wrap gap-2">
              {registrars.map((registrar) => (
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
      )}
    </div>
  )
}
