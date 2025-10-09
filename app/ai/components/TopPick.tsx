import { Trophy, ChevronRight } from 'lucide-react'
import { SiClaude } from 'react-icons/si'
import Link from '@/components/objects/Link'
import { surfaces, colors } from '@/lib/theme'

export default function TopPick() {
  return (
    <div className="px-4 mb-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-200 flex items-center gap-2">
        <Trophy size={24} className="sm:w-8 sm:h-8 text-orange-300" />
        <span className="flex items-center gap-1">
          Top Pick of <i className="-ml-[1.55px]">2025</i>
        </span>
      </h2>
      <div className={surfaces.card.featured}>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <SiClaude className="text-4xl sm:text-5xl md:text-6xl flex-shrink-0" style={{ color: colors.accents.ai }} />
            <div className="min-w-0">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-100">Claude</h3>
              <p className="text-sm sm:text-base text-gray-400">by Anthropic</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Link href="https://claude.ai" className="flex items-center gap-1 text-sm sm:text-base hover:text-blue-300">
                  Visit <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                </Link>
                <Link href="/ai/usage" className="flex items-center gap-1 text-sm sm:text-base hover:text-blue-300">
                  My Usage <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Claude has become my go-to AI assistant for coding, writing, and learning very quickly.
              I believe their Max 5x ($100/mo) is the best value for budget-conscious consumers like myself.
            </p>
            <div className='flex flex-col items-center gap-y-6 sm:flex-row sm:justify-between'>
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                <span className={surfaces.badge.default}>Top-Tier Tool Calling</span>
                <span className={surfaces.badge.default}>High-Value Plans</span>
                <span className={surfaces.badge.default}>Good Speed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
