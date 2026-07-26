'use client'

import { useState, type ReactNode } from 'react'
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { SiClaude } from 'react-icons/si'
import { Antigravity } from '@lobehub/icons'
import OhMyPiIcon from '@/components/icons/OhMyPiIcon'
import Link from '@/components/objects/Link'
import { surfaces, colors, cn } from '@/lib/theme'
import { TbArrowRight, TbArrowUpRight } from 'react-icons/tb'

interface TopPickItem {
  year: string
  name: string
  provider: string
  icon: ReactNode
  link: string
  usage?: string
  description: string
  badges: string[]
  cardClassName: string
}

const topPicks: TopPickItem[] = [
  {
    year: 'Mid 2026',
    name: 'Oh My Pi',
    provider: 'by Oh My Pi',
    icon: <OhMyPiIcon size={64} className="shrink-0" />,
    link: 'https://omp.sh/',
    description: `Oh My Pi (omp) is my new preferred AI coding harness. It's better with orchestrating subagents, and I find its TUI to be more stable than other harnasses. While I've considered Pi, I prefer the default Oh My Pi provides, especially with regards to provider support and configuration.`,
    badges: [
      'Best for Provider Support',
      'Best TUI',
      'Best for Subagent Orchestration'
    ],
    cardClassName: 'border-[#ec4899] bg-[#ec4899]/5'
  },
  {
    year: 'Early 2026',
    name: 'Antigravity',
    provider: 'by Google',
    icon: <Antigravity.Color size={64} className="shrink-0" />,
    link: 'https://antigravity.google',
    description:
      'Antigravity has become my go-to AI harnass for coding and agent work. Gemini models with a subscription offer a good balance of quality and price.',
    badges: [
      'Decent Harnasses (Antigravity + IDE)',
      'Good Reasoning Models',
      'Good Price-to-Performance Ratio'
    ],
    cardClassName: 'border-[#4285f4] bg-[#4285f4]/5'
  },
  {
    year: '2025',
    name: 'Claude',
    provider: 'by Anthropic',
    icon: (
      <SiClaude
        className="shrink-0 text-4xl sm:text-5xl md:text-6xl"
        style={{ color: colors.accents.ai }}
      />
    ),
    link: 'https://claude.ai',
    usage: '/ai/usage',
    description:
      'Claude has become my go-to AI assistant for coding, writing, and learning very quickly. I believe their Max 5x ($100/mo) is the best value for budget-conscious consumers like myself.',
    badges: ['Top-Tier Tool Calling', 'High-Value Plans', 'Good Speed'],
    cardClassName: 'border-[#c15f3c] bg-orange-500/5'
  }
]

export default function TopPick() {
  const [selectedYearIndex, setSelectedYearIndex] = useState(0)

  const currentPick = topPicks[selectedYearIndex]
  const hasPrevYear = selectedYearIndex < topPicks.length - 1
  const hasNextYear = selectedYearIndex > 0

  return (
    <div className="mb-4 px-4">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-200 sm:mb-6 sm:text-3xl md:text-4xl">
        <Trophy size={24} className="text-orange-300 sm:h-8 sm:w-8" />
        <span className="flex items-center gap-1.5">
          Top Pick of{' '}
          {hasPrevYear && (
            <button
              onClick={() => setSelectedYearIndex((prev) => prev + 1)}
              className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100 focus:ring-1 focus:ring-blue-400 focus:outline-none"
              aria-label="Previous year"
              title="Previous year"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}
          <i className="-ml-[1.55px]">{currentPick.year}</i>
          {hasNextYear && (
            <button
              onClick={() => setSelectedYearIndex((prev) => prev - 1)}
              className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100 focus:ring-1 focus:ring-blue-400 focus:outline-none"
              aria-label="Next year"
              title="Next year"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}
        </span>
      </h2>
      <div
        className={cn(
          'rounded-lg border-2 p-6 transition-colors duration-300 sm:p-8',
          currentPick.cardClassName
        )}
      >
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="flex items-center gap-3 sm:gap-4">
            {currentPick.icon}
            <div className="min-w-0">
              <div className="flex flex-row items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-100 sm:text-3xl">
                  {currentPick.name}
                </h3>
                <p className="text-sm text-gray-400 sm:text-base">
                  {currentPick.provider}
                </p>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-4 lg:mt-2 lg:gap-2">
                <Link
                  href={currentPick.link}
                  className="flex items-center gap-1 text-sm hover:text-blue-300 sm:text-base"
                >
                  Visit <TbArrowUpRight size={14} className="sm:size-4" />
                </Link>
                {currentPick.usage && (
                  <Link
                    href={currentPick.usage}
                    className="flex items-center gap-1 text-sm hover:text-blue-300 sm:text-base"
                  >
                    My Usage <TbArrowRight size={14} className="sm:size-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
              {currentPick.description}
            </p>
            <div className="flex flex-col items-center gap-y-6 sm:flex-row sm:justify-between">
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {currentPick.badges.map((badge) => (
                  <span key={badge} className={surfaces.badge.default}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
