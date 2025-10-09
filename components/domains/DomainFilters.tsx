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
  const [selectedCategories, setSelectedCategories] = useState<DomainCategory[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<DomainStatus[]>([])
  const [selectedRegistrars, setSelectedRegistrars] = useState<DomainRegistrarId[]>([])
  const [sortBy, setSortBy] = useState<DomainSortOption>('name')
  const [showFilters, setShowFilters] = useState(false)

  const categories: DomainCategory[] = ['personal', 'service', 'project', 'fun', 'legacy']
  const statuses: DomainStatus[] = ['active', 'parked', 'reserved']

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  const toggleCategory = (category: DomainCategory) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    onCategoryChange(updated)
  }

  const toggleStatus = (status: DomainStatus) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status]
    setSelectedStatuses(updated)
    onStatusChange(updated)
  }

  const toggleRegistrar = (registrar: DomainRegistrarId) => {
    const updated = selectedRegistrars.includes(registrar)
      ? selectedRegistrars.filter(r => r !== registrar)
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

  const hasActiveFilters = search || selectedCategories.length > 0 || selectedStatuses.length > 0 || selectedRegistrars.length > 0

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search domains..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-700"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-300'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-slate-500/20 text-slate-400 rounded-full">
              Active
            </span>
          )}
        </button>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as DomainSortOption)}
          className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-gray-700"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {showFilters && (
        <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-300">Filter Options</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-2">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                      : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedStatuses.includes(status)
                      ? 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                      : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-2">Registrar</h4>
            <div className="flex flex-wrap gap-2">
              {registrars.map(registrar => (
                <button
                  key={registrar}
                  onClick={() => toggleRegistrar(registrar)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedRegistrars.includes(registrar)
                      ? 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                      : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600'
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