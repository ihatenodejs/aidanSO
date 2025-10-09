'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { BookText, Menu, Info } from 'lucide-react'
import DocsSidebar from '@/components/docs/DocsSidebar'
import DocsSearch from '@/components/docs/DocsSearch'
import FunctionDoc from '@/components/docs/FunctionDoc'
import TypeDoc from '@/components/docs/TypeDoc'
import { searchDocs } from '@/lib/docs/search'
import { cn } from '@/lib/utils'
import { surfaces, colors, effects } from '@/lib/theme'
import type { DocNavigation, DocItem } from '@/lib/docs/types'

interface DocsPageClientProps {
  navigation: DocNavigation
  allItems: DocItem[]
}

type ViewMode = 'parsed' | 'html'

const ITEMS_PER_PAGE = 20

export default function DocsPageClient({
  navigation,
  allItems,
}: DocsPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('parsed')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)

  // Create a set of all available type IDs for validation
  const availableTypeIds = useMemo(() => {
    return new Set(allItems.map(item => item.name))
  }, [allItems])

  useEffect(() => {
    const saved = localStorage.getItem('docs-view-mode')
    if (saved === 'parsed' || saved === 'html') {
      setViewMode(saved)
    }
  }, [])

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('docs-view-mode', mode)
  }

  const filteredItems = useMemo(() => {
    let items = allItems

    if (searchQuery) {
      items = searchDocs(items, searchQuery)
    }

    return items
  }, [allItems, searchQuery])

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleItems)
  }, [filteredItems, visibleItems])

  const hasMoreItems = visibleItems < filteredItems.length

  const loadMoreItems = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length))
      setIsLoading(false)
    }, 300)
  }, [filteredItems.length])

  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE)
  }, [searchQuery])

  useEffect(() => {
    if (!hasMoreItems || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 }
    )

    const sentinel = document.getElementById('scroll-sentinel')
    if (sentinel) observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasMoreItems, isLoading, loadMoreItems])

  return (
    <div className="w-full px-2 sm:px-6 pb-16">
      <div className="my-12 text-center">
        <div className="flex justify-center mb-6">
          <BookText size={60} />
        </div>
        <h1 className="text-4xl font-bold mb-2 glow" style={{ color: colors.text.primary }}>Documentation</h1>
        <p style={{ color: colors.text.muted }}>Complete API reference for aidxnCC</p>

        <div className="mt-6 flex justify-center items-center gap-3">
          <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>
            Parsed
          </span>
          <button
            onClick={() => handleViewModeChange(viewMode === 'parsed' ? 'html' : 'parsed')}
            className="relative inline-flex h-7 w-14 items-center rounded-full border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            style={{
              backgroundColor: viewMode === 'html' ? colors.accents.ai : colors.backgrounds.card,
              borderColor: viewMode === 'html' ? colors.accents.ai : colors.borders.default
            }}
          >
            <span className="sr-only">Toggle view mode</span>
            <span
              className={`${viewMode === 'parsed' ? 'translate-x-1' : 'translate-x-7'} inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm`}
            />
          </button>
          <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>
            HTML
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl">
        {viewMode === 'html' ? (
          <iframe
            src="/docs/html/index.html"
            className="w-full border-0 rounded-lg"
            style={{
              height: 'calc(100vh - 300px)',
              minHeight: '600px',
              backgroundColor: colors.backgrounds.card,
            }}
            title="TypeDoc HTML Documentation"
          />
        ) : (
          <>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className={cn(
                'lg:hidden fixed bottom-6 right-6 z-40',
                'flex items-center gap-2 rounded-lg px-4 py-3',
                'border-2 shadow-lg',
                effects.transitions.colors
              )}
              style={{
                backgroundColor: colors.backgrounds.card,
                borderColor: colors.borders.default,
                color: colors.text.secondary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgrounds.hover
                e.currentTarget.style.borderColor = colors.borders.hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgrounds.card
                e.currentTarget.style.borderColor = colors.borders.default
              }}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
              <span className="text-sm font-medium">Menu</span>
            </button>

            {isMobileSidebarOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  aria-hidden="true"
                />
                <div className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden overflow-y-auto">
                  <DocsSidebar
                    navigation={navigation}
                    onClose={() => setIsMobileSidebarOpen(false)}
                  />
                </div>
              </>
            )}

            <div className="flex gap-6">
              <DocsSidebar navigation={navigation} className="hidden lg:block" />

              <main className="flex-1 w-full lg:max-w-4xl space-y-6">
                <DocsSearch
                  items={allItems}
                  onSearch={setSearchQuery}
                />

                {!searchQuery && (
                  <section
                    className={cn(
                      'rounded-xl p-6 border-2 relative overflow-hidden',
                      effects.transitions.all
                    )}
                    style={{
                      backgroundColor: colors.accents.docsBg,
                      borderColor: colors.accents.docsBorder,
                      boxShadow: `0 0 20px ${colors.accents.docsGlow}`,
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                      style={{ backgroundColor: colors.accents.docsBlur }}
                    />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: colors.accents.docsIconBg,
                            color: colors.accents.docs
                          }}
                        >
                          <Info className="h-5 w-5" />
                        </div>
                        <h2
                          className="text-2xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Getting Started
                        </h2>
                      </div>

                      <p
                        className="leading-relaxed mb-6 text-base"
                        style={{ color: colors.text.body }}
                      >
                        Welcome to the aidxnCC documentation! This reference contains
                        detailed information about all services, utilities, types, and
                        components available in my codebase.
                      </p>

                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5"
                      >
                        {[
                          { label: 'Services', desc: 'Core business logic for AI, Device, and Domain management' },
                          { label: 'Utils', desc: 'Utility functions for formatting, styling, and common operations' },
                          { label: 'Types', desc: 'TypeScript type definitions and interfaces' },
                          { label: 'Theme', desc: 'Design tokens, colors, and surface styles' },
                          { label: 'Devices', desc: 'Device specifications and portfolio management' },
                          { label: 'Domains', desc: 'Domain portfolio and DNS management utilities' },
                          { label: 'Docs', desc: 'Documentation parsing and search functionality' },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="p-3 rounded-lg border"
                            style={{
                              backgroundColor: colors.backgrounds.card,
                              borderColor: colors.borders.subtle,
                            }}
                          >
                            <strong
                              className="text-sm font-semibold block mb-1"
                              style={{ color: colors.accents.docs }}
                            >
                              {item.label}
                            </strong>
                            <span
                              className="text-xs leading-relaxed"
                              style={{ color: colors.text.muted }}
                            >
                              {item.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Documentation Items */}
                {displayedItems.length > 0 ? (
                  <div className="space-y-6">
                    {displayedItems.map((item) => (
                      <section
                        key={item.id}
                        className={cn(surfaces.section.default)}
                      >
                        {item.kind === 'function' || item.kind === 'method' ? (
                          <FunctionDoc item={item} availableTypeIds={availableTypeIds} />
                        ) : (
                          <TypeDoc item={item} availableTypeIds={availableTypeIds} />
                        )}
                      </section>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <section className={cn(surfaces.section.default, 'text-center')}>
                    <p style={{ color: colors.text.muted }}>
                      No results found for &quot;{searchQuery}&quot;
                    </p>
                    <p className="mt-2 text-sm" style={{ color: colors.text.disabled }}>
                      Try adjusting your search query
                    </p>
                  </section>
                ) : null}
              </main>
            </div>
          </>
        )}
      </div>
    </div>
  )
}