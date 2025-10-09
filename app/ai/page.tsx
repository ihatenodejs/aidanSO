"use client"

import PageHeader from '@/components/objects/PageHeader'
import { Brain } from 'lucide-react'
import TopPick from './components/TopPick'
import AIStack from './components/AIStack'
import FavoriteModels from './components/FavoriteModels'
import FavoriteTools from './components/FavoriteTools'
import { aiTools, favoriteModels, aiReviews } from './data'

export default function AI() {
  return (
    <div className="w-full px-2 sm:px-6">
        <div className="my-12 text-center">
          <PageHeader
            icon={<Brain size={60} />}
            title="AI"
            subtitle="My journey with using LLMs"
          />
        </div>

        <TopPick />

        <div className="p-4">
          <AIStack tools={aiTools} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <FavoriteModels models={favoriteModels} />
          <FavoriteTools reviews={aiReviews} />
        </div>
    </div>
  )
}