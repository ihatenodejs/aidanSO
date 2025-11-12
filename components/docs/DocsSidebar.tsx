'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { colors } from '@/lib/theme'
import type { DocNavigation, DocCategory } from '@/lib/docs/types'
import {
  Settings,
  Wrench,
  FileText,
  Palette,
  Globe,
  Package,
  Sliders,
  ChevronDown,
  ChevronRight,
  X,
  Smartphone,
  Network,
  BookOpen
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * @public
 */
export interface DocsSidebarProps {
  navigation: DocNavigation
  currentItemId?: string
  className?: string
  onClose?: () => void
}

const categoryIcons: Record<DocCategory, LucideIcon> = {
  Services: Settings,
  Utils: Wrench,
  Types: FileText,
  Theme: Palette,
  Devices: Smartphone,
  Domains: Network,
  Configuration: Sliders,
  Docs: BookOpen,
  API: Globe,
  Other: Package
}

export default function DocsSidebar({
  navigation,
  currentItemId,
  className,
  onClose
}: DocsSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(navigation.sections.map((s) => s.title))
  )

  const isMobileDrawer = !!onClose

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <aside
      className={cn(
        isMobileDrawer
          ? 'h-full w-full overflow-y-auto'
          : 'sticky top-20 h-[calc(100vh-8rem)] w-64 overflow-y-auto',
        isMobileDrawer ? 'border-r-0' : 'border-r-2',
        className
      )}
      style={{
        borderColor: isMobileDrawer ? 'transparent' : colors.borders.default,
        backgroundColor: isMobileDrawer
          ? colors.backgrounds.cardSolid
          : 'transparent'
      }}
    >
      {/* Mobile Header with Close Button */}
      {isMobileDrawer && (
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b-2 p-4"
          style={{
            backgroundColor: colors.backgrounds.cardSolid,
            borderColor: colors.borders.default
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: colors.text.primary }}
          >
            Navigation
          </h2>
          <button
            onClick={onClose}
            className={cn('rounded-md p-2', 'transition-colors duration-300')}
            style={{ color: colors.text.muted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgrounds.hover
              e.currentTarget.style.color = colors.text.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = colors.text.muted
            }}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <nav className="space-y-2 p-4">
        {navigation.sections.map((section) => {
          const isExpanded = expandedSections.has(section.title)
          const Icon = categoryIcons[section.category]

          return (
            <div key={section.title} className="space-y-1">
              <button
                onClick={() => toggleSection(section.title)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2',
                  'text-sm font-medium',
                  'transition-colors duration-300'
                )}
                style={{
                  color: colors.text.secondary,
                  backgroundColor: isExpanded
                    ? colors.backgrounds.hover
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.backgroundColor =
                      colors.backgrounds.hover
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{section.title}</span>
                <span
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={{
                    color: colors.text.disabled,
                    backgroundColor: colors.backgrounds.card
                  }}
                >
                  {section.items.length}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-6 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = item.id === currentItemId

                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={isMobileDrawer ? onClose : undefined}
                        className={cn(
                          'block rounded-md px-3 py-1.5',
                          'text-sm transition-colors duration-300'
                        )}
                        style={{
                          color: isActive
                            ? colors.text.primary
                            : colors.text.muted,
                          backgroundColor: isActive
                            ? colors.backgrounds.hover
                            : 'transparent',
                          fontWeight: isActive ? 500 : 400
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              colors.backgrounds.hover
                            e.currentTarget.style.color = colors.text.secondary
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              'transparent'
                            e.currentTarget.style.color = colors.text.muted
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'flex-shrink-0 rounded px-1.5 py-0.5 font-mono text-xs'
                            )}
                            style={{
                              backgroundColor: colors.backgrounds.card,
                              color: colors.text.disabled
                            }}
                          >
                            {item.kind === 'function' && 'fn'}
                            {item.kind === 'method' && 'fn'}
                            {item.kind === 'class' && 'class'}
                            {item.kind === 'interface' && 'interface'}
                            {item.kind === 'type' && 'type'}
                            {item.kind === 'variable' && 'const'}
                            {item.kind === 'property' && 'prop'}
                            {item.kind === 'enum' && 'enum'}
                          </span>
                          <span className="truncate">{item.name}</span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
