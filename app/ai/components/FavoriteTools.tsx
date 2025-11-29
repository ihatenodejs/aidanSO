import { TbTool } from 'react-icons/tb'
import PaginatedCardList from '@/components/ui/PaginatedCardList'
import type { AIReview } from '../types'

/**
 * @public
 */
export interface FavoriteToolsProps {
  reviews: AIReview[]
}

export default function FavoriteTools({ reviews }: FavoriteToolsProps) {
  return (
    <PaginatedCardList
      items={reviews}
      title="Favorite Tools"
      icon={<TbTool size={24} />}
      subtitle="Based on personal preference"
      itemsPerPage={3}
      getItemKey={(review) => review.tool}
      renderItem={(review) => (
        <div className="rounded-lg bg-gray-800/50 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
            <h3 className="flex-1 truncate text-sm font-semibold text-gray-200 sm:text-base">
              {review.tool}
            </h3>
            <div className="flex shrink-0 items-center gap-1 rounded-md border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 sm:px-3 sm:py-1">
              <span className="sm:text-md text-base font-bold text-yellow-400">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="mb-2 grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <div>
              <p className="mb-1 text-xs font-medium text-green-400/65 sm:text-sm">
                Pros:
              </p>
              <ul className="space-y-0.5 text-gray-300 sm:space-y-1">
                {review.pros.map((pro, i) => (
                  <li key={i} className="text-xs leading-tight">
                    • {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-red-400/65 sm:text-sm">
                Cons:
              </p>
              <ul className="space-y-0.5 text-gray-300 sm:space-y-1">
                {review.cons.map((con, i) => (
                  <li key={i} className="text-xs leading-tight">
                    • {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-400 sm:text-sm">
            {review.verdict}
          </p>
        </div>
      )}
    />
  )
}
