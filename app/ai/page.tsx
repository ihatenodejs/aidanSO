'use client'

import PageHeader from '@/components/objects/PageHeader'
import PageShell from '@/components/layout/PageShell'
import { Brain } from 'lucide-react'
import TopPick from './components/TopPick'
import AIStack from './components/AIStack'
import FavoriteModels from './components/FavoriteModels'
import FavoriteTools from './components/FavoriteTools'
import {
  aiTools,
  favoriteModels,
  aiReviews,
  inactiveAiTools
} from '@/lib/config/ai-usage'
import { isInactiveTool } from './types'

const statusOrder = {
  primary: 0,
  active: 1,
  occasional: 2,
  unused: 3,
  cancelled: 4
} as const

export default function AI() {
  const activeTools = aiTools
    .filter((tool) => !isInactiveTool(tool))
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  const sortedInactiveTools = [...inactiveAiTools].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  )

  return (
    <PageShell variant="full-width" className="px-2 sm:px-6">
      <div className="my-12 text-center">
        <PageHeader
          icon={<Brain size={60} />}
          title="AI"
          subtitle="My opinions and experience concerning LLMs"
        />
      </div>

      <TopPick />

      <div className="p-4 pb-1">
        <AIStack tools={activeTools} />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 py-1 lg:grid-cols-2">
        <FavoriteModels models={favoriteModels} />
        <FavoriteTools reviews={aiReviews} />
      </div>

      {sortedInactiveTools.length > 0 && (
        <div className="p-4 pt-1">
          <AIStack
            tools={sortedInactiveTools}
            title="Unused Tools"
            subtitle="Retired or cancelled tools discontinued from my AI stack."
          />
        </div>
      )}
    </PageShell>
  )
}
