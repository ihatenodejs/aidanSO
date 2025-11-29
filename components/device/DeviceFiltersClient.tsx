'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, X } from 'lucide-react'
import type { ClientDeviceWithMetrics } from '@/lib/types/client-device'
import { ClientDeviceService } from '@/lib/services/client-device.service'
import { CardGrid } from '@/components/ui/CardGrid'
import DeviceCard from '@/components/device/DeviceCard'

/**
 * @public
 */
export interface DeviceFiltersClientProps {
  devices: ClientDeviceWithMetrics[]
  manufacturers: string[]
  releaseYears: number[]
  sidebarMode?: boolean
  showOnlyCards?: boolean
}

const deviceTypes = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'dap', label: 'DAP' }
] as const

export default function DeviceFiltersClient({
  devices,
  manufacturers,
  releaseYears,
  sidebarMode = false,
  showOnlyCards = false
}: DeviceFiltersClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'mobile' | 'dap'>(
    'all'
  )
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')
  const [showFilters, setShowFilters] = useState(sidebarMode)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setSelectedManufacturer('all')
    setSelectedYear('all')
  }

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'all' ||
    selectedManufacturer !== 'all' ||
    selectedYear !== 'all'

  const toggleType = (type: 'mobile' | 'dap') => {
    setSelectedType(selectedType === type ? 'all' : type)
  }

  const toggleManufacturer = (manufacturer: string) => {
    setSelectedManufacturer(
      selectedManufacturer === manufacturer ? 'all' : manufacturer
    )
  }

  const toggleYear = (year: number) => {
    setSelectedYear(selectedYear === year ? 'all' : year)
  }

  const filteredDevices = useMemo(() => {
    let filtered = devices

    if (selectedType !== 'all') {
      filtered = filtered.filter((device) => device.type === selectedType)
    }

    if (selectedManufacturer !== 'all') {
      filtered = filtered.filter(
        (device) => device.manufacturer === selectedManufacturer
      )
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(
        (device) => device.releaseYear === selectedYear
      )
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter((device) => {
        const matchesBasic =
          device.name.toLowerCase().includes(searchLower) ||
          device.codename?.toLowerCase().includes(searchLower) ||
          device.manufacturer?.toLowerCase().includes(searchLower) ||
          device.status?.toLowerCase().includes(searchLower) ||
          device.tagline?.toLowerCase().includes(searchLower)

        if (matchesBasic) return true

        const matchesRows = device.sections.some((section) => {
          if (!section.rows) return false
          return section.rows.some((row) => {
            return (
              row.label.toLowerCase().includes(searchLower) ||
              row.value.toLowerCase().includes(searchLower) ||
              row.filterValue?.toLowerCase().includes(searchLower)
            )
          })
        })

        return matchesRows
      })
    }

    return ClientDeviceService.sortDevices(
      filtered,
      'releaseYear',
      'desc'
    ).sort((a, b) => {
      if (a.releaseYear === b.releaseYear) {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  }, [devices, searchQuery, selectedType, selectedManufacturer, selectedYear])

  if (showOnlyCards) {
    return (
      <div className="space-y-4">
        {/* Device Cards Grid */}
        <CardGrid cols="3">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.slug} device={device} />
          ))}
        </CardGrid>

        {filteredDevices.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-400">No devices match your filters</p>
          </div>
        )}
      </div>
    )
  }

  if (sidebarMode) {
    return (
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices..."
            className="w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 pr-4 pl-10 text-gray-200 placeholder-gray-500 focus:border-gray-700 focus:outline-none"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400"
          >
            <X className="h-3 w-3" />
            Clear all filters
          </button>
        )}

        {/* Filter Options */}
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-xs text-gray-500">Device Type</h4>
            <div className="flex flex-wrap gap-2">
              {deviceTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => toggleType(type.value)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selectedType === type.value
                      ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs text-gray-500">Manufacturer</h4>
            <div className="flex flex-wrap gap-2">
              {manufacturers.map((manufacturer) => (
                <button
                  key={manufacturer}
                  onClick={() => toggleManufacturer(manufacturer)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selectedManufacturer === manufacturer
                      ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {manufacturer}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs text-gray-500">Release Year</h4>
            <div className="flex flex-wrap gap-2">
              {releaseYears.map((year) => (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selectedYear === year
                      ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices, codenames, Android versions..."
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
      </div>

      {showFilters && (
        <div className="space-y-4 rounded-lg border-2 border-gray-700 bg-gray-200/5 p-4 transition-colors duration-300 hover:border-gray-600">
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
            <h4 className="mb-2 text-xs text-gray-500">Device Type</h4>
            <div className="flex flex-wrap gap-2">
              {deviceTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => toggleType(type.value)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selectedType === type.value
                      ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs text-gray-500">Manufacturer</h4>
            <div className="flex flex-wrap gap-2">
              {manufacturers.map((manufacturer) => (
                <button
                  key={manufacturer}
                  onClick={() => toggleManufacturer(manufacturer)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selectedManufacturer === manufacturer
                      ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {manufacturer}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs text-gray-500">Release Year</h4>
            <div className="flex flex-wrap gap-2">
              {releaseYears.map((year) => (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selectedYear === year
                      ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Device Cards Grid */}
      <CardGrid cols="3">
        {filteredDevices.map((device) => (
          <DeviceCard key={device.slug} device={device} />
        ))}
      </CardGrid>

      {filteredDevices.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-400">No devices match your filters</p>
        </div>
      )}
    </div>
  )
}
