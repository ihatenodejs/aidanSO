import { Trophy, ChevronRight } from 'lucide-react'
import { SiClaude } from 'react-icons/si'
import Link from '@/components/objects/Link'
import { surfaces, colors } from '@/lib/theme'

export default function TopPick() {
  return (
    <div className="mb-4 px-4">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-200 sm:mb-6 sm:text-3xl md:text-4xl">
        <Trophy size={24} className="text-orange-300 sm:h-8 sm:w-8" />
        <span className="flex items-center gap-1">
          Top Pick of <i className="-ml-[1.55px]">2025</i>
        </span>
      </h2>
      <div className={surfaces.card.featured}>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <SiClaude
              className="shrink-0 text-4xl sm:text-5xl md:text-6xl"
              style={{ color: colors.accents.ai }}
            />
            <div className="min-w-0">
              <div className="flex flex-row items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-100 sm:text-3xl">
                  Claude
                </h3>
                <p className="text-sm text-gray-400 sm:text-base">
                  by Anthropic
                </p>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-4 lg:mt-2 lg:gap-2">
                <Link
                  href="https://claude.ai"
                  className="flex items-center gap-1 text-sm hover:text-blue-300 sm:text-base"
                >
                  Visit <ChevronRight size={14} className="sm:h-4 sm:w-4" />
                </Link>
                <Link
                  href="/ai/usage"
                  className="flex items-center gap-1 text-sm hover:text-blue-300 sm:text-base"
                >
                  My Usage <ChevronRight size={14} className="sm:h-4 sm:w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
              Claude has become my go-to AI assistant for coding, writing, and
              learning very quickly. I believe their Max 5x ($100/mo) is the
              best value for budget-conscious consumers like myself.
            </p>
            <div className="flex flex-col items-center gap-y-6 sm:flex-row sm:justify-between">
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className={surfaces.badge.default}>
                  Top-Tier Tool Calling
                </span>
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
