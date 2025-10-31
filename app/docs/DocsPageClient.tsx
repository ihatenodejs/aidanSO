'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import DocsSidebar from '@/components/docs/DocsSidebar'
import DocsSearch from '@/components/docs/DocsSearch'
import FunctionDoc from '@/components/docs/FunctionDoc'
import TypeDoc from '@/components/docs/TypeDoc'
import TypeDocIframe from '@/components/docs/TypeDocIframe'
import { searchDocs } from '@/lib/docs/search'
import type {
  DocNavigation,
  DocSection,
  DocItem,
  DocCategory
} from '@/lib/docs/types'
import { colors } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'

interface DocsPageClientProps {
  sections: DocSection[]
  navigation: DocNavigation
  items: DocItem[]
}

type ViewMode = 'parsed' | 'iframe'

const CATEGORY_ORDER: DocCategory[] = [
  'Services',
  'Utils',
  'Types',
  'Theme',
  'Devices',
  'Domains',
  'Configuration',
  'Docs',
  'API',
  'Other'
]

export default function DocsPageClient({
  sections,
  navigation,
  items
}: DocsPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'parsed'

    const stored = window.localStorage.getItem('docs-view-mode')
    return stored === 'parsed' || stored === 'iframe' ? stored : 'parsed'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [currentItemId, setCurrentItemId] = useState<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined
    return window.location.hash ? window.location.hash.slice(1) : undefined
  })
  const mainContentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleHashChange = () => {
      setCurrentItemId(
        window.location.hash ? window.location.hash.replace('#', '') : undefined
      )
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)

    if (mode === 'iframe') {
      setIsMobileNavOpen(false)
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('docs-view-mode', mode)
    }
  }

  const availableTypeIds = useMemo(
    () =>
      new Set(
        items
          .filter((item) => item.kind === 'type' || item.kind === 'interface')
          .map((item) => item.name)
      ),
    [items]
  )

  const searchResults = useMemo(
    () => searchDocs(items, searchQuery),
    [items, searchQuery]
  )

  const displayedSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return sections
    }

    const grouped = new Map<DocCategory, DocItem[]>()

    for (const item of searchResults) {
      const existing = grouped.get(item.category) || []
      existing.push(item)
      grouped.set(item.category, existing)
    }

    return CATEGORY_ORDER.filter((category) => grouped.has(category)).map(
      (category) => ({
        title: category,
        category,
        items: grouped
          .get(category)!
          .sort((a, b) => a.name.localeCompare(b.name))
      })
    )
  }, [searchQuery, sections, searchResults])

  const renderDocItem = (item: DocItem) => {
    if (item.kind === 'function' || item.kind === 'method') {
      return (
        <FunctionDoc
          key={item.id}
          item={item}
          availableTypeIds={availableTypeIds}
          className="pb-12 last:pb-0"
        />
      )
    }

    return (
      <TypeDoc
        key={item.id}
        item={item}
        availableTypeIds={availableTypeIds}
        className="pb-12 last:pb-0"
      />
    )
  }

  const isParsedView = viewMode === 'parsed'

  return (
    <div className="flex w-full flex-1">
      {!isParsedView && (
        <ViewModeToggle
          value={viewMode}
          onChange={handleViewModeChange}
          variant="floating"
        />
      )}

      {isParsedView && (
        <div className="hidden lg:block">
          <DocsSidebar navigation={navigation} currentItemId={currentItemId} />
        </div>
      )}

      <main ref={mainContentRef} className="flex-1 overflow-y-auto">
        <div
          className={cn(
            'w-full border-b px-4 pt-6 pb-6 sm:px-6 lg:px-10',
            isParsedView && 'sticky top-0 z-30'
          )}
          style={{
            borderColor: colors.borders.default,
            backgroundColor: colors.backgrounds.cardSolid
          }}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {isParsedView && (
              <div className="flex w-full items-center justify-between gap-3 lg:justify-end">
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(true)}
                  className={cn(
                    'inline-flex items-center gap-2 self-start rounded-md border-2 px-3 py-2 text-sm font-medium lg:hidden',
                    'transition-colors duration-200'
                  )}
                  style={{
                    color: colors.text.secondary,
                    borderColor: colors.borders.default,
                    backgroundColor: colors.backgrounds.card
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.borderColor = colors.borders.hover
                    event.currentTarget.style.color = colors.text.primary
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.borderColor =
                      colors.borders.default
                    event.currentTarget.style.color = colors.text.secondary
                  }}
                  aria-label="Open documentation navigation"
                >
                  <Menu className="h-4 w-4" />
                  Navigation
                </button>

                <ViewModeToggle
                  value={viewMode}
                  onChange={handleViewModeChange}
                  className="ml-auto"
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            'mx-auto flex w-full flex-col',
            isParsedView
              ? 'max-w-5xl gap-10 px-4 py-8 sm:px-6 lg:px-12'
              : 'max-w-none gap-0 px-0 py-0'
          )}
        >
          {isParsedView ? (
            <>
              <DocsSearch items={searchResults} onSearch={setSearchQuery} />

              {searchQuery.trim() && displayedSections.length === 0 ? (
                <div
                  className="rounded-lg border-2 p-6 text-center text-sm"
                  style={{
                    borderColor: colors.borders.subtle,
                    backgroundColor: colors.backgrounds.card
                  }}
                >
                  <p style={{ color: colors.text.secondary }}>
                    No documentation entries match “{searchQuery}”.
                  </p>
                </div>
              ) : (
                displayedSections.map((section) => (
                  <section key={section.category} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2
                        className="text-2xl font-semibold"
                        style={{ color: colors.text.secondary }}
                      >
                        {section.title}
                      </h2>
                      <span
                        className="rounded-full px-3 py-1 text-xs"
                        style={{
                          color: colors.text.disabled,
                          backgroundColor: colors.backgrounds.card
                        }}
                      >
                        {section.items.length} item
                        {section.items.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="space-y-12">
                      {section.items.map(renderDocItem)}
                    </div>
                  </section>
                ))
              )}
            </>
          ) : (
            <TypeDocIframe />
          )}
        </div>
      </main>

      {isParsedView && isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto h-full w-80 max-w-[80vw]">
            <DocsSidebar
              navigation={navigation}
              currentItemId={currentItemId}
              onClose={() => setIsMobileNavOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface ViewModeToggleProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
  variant?: 'surface' | 'floating'
  className?: string
}

function ViewModeToggle({
  value,
  onChange,
  variant = 'surface',
  className
}: ViewModeToggleProps) {
  const options: Array<{ value: ViewMode; label: string }> = [
    { value: 'parsed', label: 'Parsed' },
    { value: 'iframe', label: 'TypeDoc' }
  ]

  const isFloating = variant === 'floating'

  const baseStyle = {
    borderRadius: '9999px',
    border: `1px solid ${colors.borders.default}`,
    background: `linear-gradient(135deg, ${colors.backgrounds.cardSolid}, rgba(17, 24, 39, 0.92))`,
    boxShadow: '0 16px 40px rgba(3, 7, 18, 0.4)',
    backdropFilter: 'blur(12px)'
  } as const

  const containerStyle = isFloating
    ? {
        ...baseStyle,
        top: 'calc(4.75rem + env(safe-area-inset-top, 0px))',
        right: 'calc(1rem + env(safe-area-inset-right, 0px))'
      }
    : baseStyle

  return (
    <div
      role="radiogroup"
      aria-label="Documentation view mode"
      className={cn(
        'flex items-center gap-1 rounded-full p-1',
        isFloating ? 'pointer-events-auto fixed z-50' : '',
        className
      )}
      style={containerStyle}
    >
      {options.map((option, index) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm',
              index === 0 && 'rounded-l-full',
              index === options.length - 1 && 'rounded-r-full',
              'hover:bg-[rgba(55,65,81,0.45)] focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(17,24,39,0.85)] focus-visible:outline-none'
            )}
            style={{
              color: isActive ? colors.text.primary : colors.text.body,
              backgroundColor: isActive ? colors.accents.linkBg : 'transparent',
              boxShadow: isActive
                ? `0 0 0 1px ${colors.accents.link}`
                : undefined
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
