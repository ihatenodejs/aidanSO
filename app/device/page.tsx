'use client'

import { useState, useMemo } from 'react'
import PageHeader from '@/components/objects/PageHeader'
import PageShell from '@/components/layout/PageShell'
import DeviceFilters from '@/components/device/DeviceFilters'
import DeviceCard from '@/components/device/DeviceCard'
import { ClientDeviceService } from '@/lib/services/client-device.service'
import { Smartphone } from 'lucide-react'

const allDevices = ClientDeviceService.getAllDevicesEnriched()

export default function DevicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'mobile' | 'dap'>(
    'all'
  )
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')

  const manufacturers = useMemo(() => {
    const mfrs = new Set<string>()
    allDevices.forEach((device) => {
      if (device.manufacturer) mfrs.add(device.manufacturer)
    })
    return Array.from(mfrs).sort()
  }, [])

  const releaseYears = useMemo(() => {
    const years = new Set<number>()
    allDevices.forEach((device) => {
      if (device.releaseYear) years.add(device.releaseYear)
    })
    return Array.from(years).sort((a, b) => b - a)
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

  const stats = useMemo(() => {
    const totalDevices = allDevices.length
    const mobileCount = allDevices.filter((d) => d.type === 'mobile').length
    const dapCount = allDevices.filter((d) => d.type === 'dap').length
    const currentYearCount = allDevices.filter((d) => d.isCurrentYear).length

    return {
      total: totalDevices,
      mobile: mobileCount,
      dap: dapCount,
      currentYear: currentYearCount
    }
  }, [])

  return (
    <PageShell variant="centered">
      <div className="flex w-full flex-col items-center text-center">
        <PageHeader icon={<Smartphone size={60} />} title="My Devices" />

        <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-gray-300">
              {stats.mobile}
            </div>
            <div className="text-sm text-gray-500">Mobile</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-gray-300">{stats.dap}</div>
            <div className="text-sm text-gray-500">DAPs</div>
          </div>
        </div>
      </div>

      <DeviceFilters
        searchQuery={searchQuery}
        selectedType={selectedType}
        selectedManufacturer={selectedManufacturer}
        selectedYear={selectedYear}
        onSearchChange={setSearchQuery}
        onTypeChange={setSelectedType}
        onManufacturerChange={setSelectedManufacturer}
        onYearChange={setSelectedYear}
        manufacturers={manufacturers}
        releaseYears={releaseYears}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDevices.map((device) => (
          <DeviceCard key={device.slug} device={device} />
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No devices match your filters</p>
        </div>
      )}
    </PageShell>
  )
}
