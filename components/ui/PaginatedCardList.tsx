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
    <section className="p-4 sm:p-6 lg:p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300 flex flex-col min-h-[500px] sm:min-h-[600px]">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground italic text-xs sm:text-sm">{subtitle}</p>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4 flex-grow mb-4 sm:mb-6 min-h-[300px] sm:min-h-[400px]">
        {currentItems.map((item, index) => {
          const globalIndex = startIndex + index
          const key = getItemKey ? getItemKey(item, globalIndex) : globalIndex
          return <div key={key}>{renderItem(item, globalIndex)}</div>
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-auto pt-4 sm:pt-6 pb-1 sm:pb-2 border-t border-gray-700">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 hover:text-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <span className="text-xs sm:text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 hover:text-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </section>
  )
}