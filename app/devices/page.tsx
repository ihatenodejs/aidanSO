'use client'

import { useMemo, useState } from 'react'
import PageHeader from '@/components/objects/PageHeader'
import PageShell from '@/components/layout/PageShell'
import { CardGrid } from '@/components/ui/CardGrid'
import DeviceCard from '@/components/device/DeviceCard'
import { ClientDeviceService } from '@/lib/services/client-device.service'
import { surfaces } from '@/lib/theme/surfaces'
import { cn } from '@/lib/utils'
import { Smartphone, Tablet, Music, Search, X } from 'lucide-react'
import DeviceFiltersClient from '@/components/device/DeviceFiltersClient'

const allDevices = ClientDeviceService.getAllDevicesEnriched()

const deviceTypes = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'dap', label: 'DAP' }
] as const

export default function DevicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'mobile' | 'dap'>(
    'all'
  )
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')

  const stats = useMemo(() => {
    return {
      mobile: allDevices.filter((d) => d.type === 'mobile').length,
      dap: allDevices.filter((d) => d.type === 'dap').length
    }
  }, [])

  const manufacturers = useMemo(() => {
    return Array.from(
      new Set(allDevices.map((device) => device.manufacturer).filter(Boolean))
    ).sort()
  }, [])

  const releaseYears = useMemo(() => {
    return Array.from(
      new Set(allDevices.map((device) => device.releaseYear).filter(Boolean))
    ).sort((a, b) => b - a)
  }, [])

  const filteredDevices = useMemo(() => {
    let filtered = allDevices

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter((device) => device.type === selectedType)
    }

    // Manufacturer filter
    if (selectedManufacturer !== 'all') {
      filtered = filtered.filter(
        (device) => device.manufacturer === selectedManufacturer
      )
    }

    // Release year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(
        (device) => device.releaseYear === selectedYear
      )
    }

    // Search filter
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
  }, [searchQuery, selectedType, selectedManufacturer, selectedYear])

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

  return (
    <PageShell variant="centered">
      <div className="flex flex-col items-center text-center">
        <PageHeader icon={<Smartphone size={60} />} title="My Devices" />

        {/* Stats Section */}
        <div className="mt-8 mb-4 grid w-full max-w-lg grid-cols-2 gap-4 sm:mt-12 sm:mb-8">
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-200">
              <Tablet className="h-5 w-5 text-blue-300" />
              {stats.mobile}
            </div>
            <div className="text-sm text-gray-500">Mobile Devices</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-200">
              <Music className="h-5 w-5 text-purple-300" />
              {stats.dap}
            </div>
            <div className="text-sm text-gray-500">Digital Audio Players</div>
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
                placeholder="Search devices..."
                className="w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 pr-4 pl-10 text-gray-200 placeholder-gray-500 focus:border-gray-700 focus:outline-none"
              />
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
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Mobile Filters */}
          <div className="mb-4 lg:hidden">
            <DeviceFiltersClient
              devices={allDevices}
              manufacturers={manufacturers}
              releaseYears={releaseYears}
            />
          </div>

          {/* Device Cards - Desktop */}
          <div className="hidden lg:block">
            <CardGrid cols="2" className="p-0">
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
        </div>
      </div>
    </PageShell>
  )
}
