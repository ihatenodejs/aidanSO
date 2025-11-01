'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo, type ReactNode } from 'react'

interface PaginatedCardListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  itemsPerPage: number
  title: string
  icon?: ReactNode
  subtitle?: string
  /** Function to extract unique key from item */
  getItemKey?: (item: T, index: number) => string | number
}

export default function PaginatedCardList<T>({
  items,
  renderItem,
  itemsPerPage,
  title,
  icon,
  subtitle,
  getItemKey
}: PaginatedCardListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const { totalPages, currentItems, startIndex } = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = items.slice(startIndex, endIndex)

    return { totalPages, currentItems, startIndex }
  }, [items, itemsPerPage, currentPage])

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <section className="flex min-h-[500px] flex-col rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:min-h-[600px] sm:p-6 lg:p-8">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-200 sm:text-2xl">
          {icon}
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-xs italic sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mb-4 min-h-[300px] grow space-y-3 sm:mb-6 sm:min-h-[400px] sm:space-y-4">
        {currentItems.map((item, index) => {
          const globalIndex = startIndex + index
          const key = getItemKey ? getItemKey(item, globalIndex) : globalIndex
          return <div key={key}>{renderItem(item, globalIndex)}</div>
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-auto flex items-center justify-between border-t border-gray-700 pt-4 pb-1 sm:pt-6 sm:pb-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-300 transition-colors hover:text-gray-100 disabled:cursor-not-allowed disabled:text-gray-600 sm:px-3 sm:py-2 sm:text-sm"
          >
            <ChevronLeft size={14} className="sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <span className="text-xs text-gray-400 sm:text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-300 transition-colors hover:text-gray-100 disabled:cursor-not-allowed disabled:text-gray-600 sm:px-3 sm:py-2 sm:text-sm"
          >
            Next
            <ChevronRight size={14} className="sm:h-4 sm:w-4" />
          </button>
        </div>
      )}
    </section>
  )
}
