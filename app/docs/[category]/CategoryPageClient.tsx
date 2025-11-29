'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import type { DocItem, DocKind } from '@/lib/docs/types'
import { cn } from '@/lib/utils'

interface CategoryPageClientProps {
  category: string
  items: DocItem[]
  availableKinds: DocKind[]
  kindColors: Record<DocKind, string>
}

export default function CategoryPageClient({
  category,
  items,
  availableKinds,
  kindColors
}: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKinds, setSelectedKinds] = useState<DocKind[]>([])

  const toggleKind = (kind: DocKind) => {
    const updated = selectedKinds.includes(kind)
      ? selectedKinds.filter((k) => k !== kind)
      : [...selectedKinds, kind]
    setSelectedKinds(updated)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedKinds([])
  }

  const hasActiveFilters = searchQuery || selectedKinds.length > 0

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesKind =
        selectedKinds.length === 0 || selectedKinds.includes(item.kind)

      return matchesSearch && matchesKind
    })
  }, [items, searchQuery, selectedKinds])

  return (
    <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:gap-8">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-80 lg:shrink-0">
        <div className="sticky top-8 rounded-lg border-2 border-gray-700 bg-gray-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-200">Filters</h3>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
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

          {/* Kind Filters */}
          <div>
            <h4 className="mb-2 text-xs text-gray-500">Kind</h4>
            <div className="flex flex-wrap gap-2">
              {availableKinds.map((kind) => (
                <button
                  key={kind}
                  onClick={() => toggleKind(kind)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    selectedKinds.includes(kind)
                      ? 'border-slate-500/40 bg-slate-500/20 text-slate-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  )}
                >
                  {kind}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-4 lg:hidden">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 pr-4 pl-10 text-gray-200 placeholder-gray-500 focus:border-gray-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/docs/${category}/${item.name}`}
              className="group rounded-lg border-2 border-gray-700 p-4 transition-all duration-300 hover:scale-[1.01] hover:border-gray-600"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-mono text-lg font-semibold text-gray-200 transition-colors duration-300 group-hover:text-gray-100">
                  {item.name}
                </h3>
                <span
                  className={cn(
                    'shrink-0 rounded border px-2 py-1 text-xs font-medium',
                    kindColors[item.kind]
                  )}
                >
                  {item.kind}
                </span>
              </div>
              {item.description && (
                <p className="mb-2 line-clamp-2 text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                  {item.description}
                </p>
              )}
              {item.signature && (
                <div className="mt-2 overflow-hidden">
                  <code className="block truncate rounded bg-gray-800 px-2 py-1 font-mono text-xs text-gray-400">
                    {item.signature}
                  </code>
                </div>
              )}
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-400">No items match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
