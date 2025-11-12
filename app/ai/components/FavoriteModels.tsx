import { Brain } from 'lucide-react'
import PaginatedCardList from '@/components/ui/PaginatedCardList'
import type { FavoriteModel } from '../types'

/**
 * @public
 */
export interface FavoriteModelsProps {
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
        <div className="rounded-lg bg-gray-800/50 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 flex-row items-center">
              <h3 className="truncate text-sm font-semibold text-gray-200 sm:text-base">
                {model.name}
              </h3>
              <p className="ml-1 text-xs text-gray-400 sm:text-sm">
                by {model.provider}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-md border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 sm:px-3 sm:py-1">
              <span className="sm:text-md text-base font-bold text-yellow-400">
                {model.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-300 sm:text-sm">
            {model.review}
          </p>
        </div>
      )}
    />
  )
}
