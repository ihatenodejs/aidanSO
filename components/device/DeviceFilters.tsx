'use client'

import { Search } from 'lucide-react'
import type { ClientDevice } from '@/lib/types/client-device'

/**
 * @public
 */
export interface DeviceFiltersProps {
  devices?: ClientDevice[]
  onFilterChange?: (filteredDevices: ClientDevice[]) => void
  className?: string
  searchQuery: string
  selectedType: 'all' | 'mobile' | 'dap'
  selectedManufacturer: string
  selectedYear: number | 'all'
  onSearchChange: (value: string) => void
  onTypeChange: (value: 'all' | 'mobile' | 'dap') => void
  onManufacturerChange: (value: string) => void
  onYearChange: (value: number | 'all') => void
  manufacturers: string[]
  releaseYears: number[]
}

export default function DeviceFilters({
  searchQuery,
  selectedType,
  selectedManufacturer,
  selectedYear,
  onSearchChange,
  onTypeChange,
  onManufacturerChange,
  onYearChange,
  manufacturers,
  releaseYears
}: DeviceFiltersProps) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search devices, codenames, Android versions..."
          className="w-full rounded-lg border border-gray-800 bg-gray-800/50 py-2.5 pr-4 pl-10 text-gray-100 placeholder-gray-400 transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Type Filter */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-400">
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) =>
              onTypeChange(e.target.value as 'all' | 'mobile' | 'dap')
            }
            className="w-full cursor-pointer rounded-lg border border-gray-800 bg-gray-800/50 px-3 py-2 text-gray-100 transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="mobile">Mobile</option>
            <option value="dap">DAP</option>
          </select>
        </div>

        {/* Manufacturer Filter */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-400">
            Manufacturer
          </label>
          <select
            value={selectedManufacturer}
            onChange={(e) => onManufacturerChange(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-gray-800 bg-gray-800/50 px-3 py-2 text-gray-100 transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="all">All Manufacturers</option>
            {manufacturers.map((mfr) => (
              <option key={mfr} value={mfr}>
                {mfr}
              </option>
            ))}
          </select>
        </div>

        {/* Release Year Filter */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-400">
            Release Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) =>
              onYearChange(
                e.target.value === 'all' ? 'all' : parseInt(e.target.value)
              )
            }
            className="w-full cursor-pointer rounded-lg border border-gray-800 bg-gray-800/50 px-3 py-2 text-gray-100 transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="all">All Years</option>
            {releaseYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
