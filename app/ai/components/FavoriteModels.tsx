import { Brain } from 'lucide-react'
import PaginatedCardList from '@/components/ui/PaginatedCardList'
import type { FavoriteModel } from '../types'

interface FavoriteModelsProps {
  models: FavoriteModel[]
}

export default function FavoriteModels({ models }: FavoriteModelsProps) {
  return (
    <PaginatedCardList
      items={models}
      title="Favorite Models"
      icon={<Brain size={24} />}
      subtitle="Based on personal preference"
      itemsPerPage={5}
      getItemKey={(model) => model.name}
      renderItem={(model) => (
        <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-200 truncate">{model.name}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{model.provider}</p>
            </div>
            <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-md flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-yellow-400">
                {model.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{model.review}</p>
        </div>
      )}
    />
  )
}
