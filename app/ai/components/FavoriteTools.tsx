import { TbTool } from 'react-icons/tb'
import PaginatedCardList from '@/components/ui/PaginatedCardList'
import type { AIReview } from '../types'

interface FavoriteToolsProps {
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
        <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg">
          <div className="flex justify-between items-center gap-2 mb-2 sm:mb-3">
            <h3 className="font-semibold text-sm sm:text-base text-gray-200 truncate flex-1">{review.tool}</h3>
            <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-md flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-yellow-400">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2 text-xs sm:text-sm">
            <div>
              <p className="text-green-400 font-medium mb-1 text-xs sm:text-sm">Pros:</p>
              <ul className="text-gray-300 space-y-0.5 sm:space-y-1">
                {review.pros.map((pro, i) => (
                  <li key={i} className="text-xs leading-tight">• {pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-red-400 font-medium mb-1 text-xs sm:text-sm">Cons:</p>
              <ul className="text-gray-300 space-y-0.5 sm:space-y-1">
                {review.cons.map((con, i) => (
                  <li key={i} className="text-xs leading-tight">• {con}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-blue-400 font-medium">{review.verdict}</p>
        </div>
      )}
    />
  )
}
