import { loadDocumentation } from '@/lib/docs/loader'
import {
  getTypeDocHTMLPath,
  extractTypeDocContent
} from '@/lib/docs/html-parser'
import PageShell from '@/components/layout/PageShell'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Home, ExternalLink } from 'lucide-react'
import {
  Settings,
  Wrench,
  FileText,
  Palette,
  Globe,
  Package,
  Sliders,
  Smartphone,
  Network,
  BookOpen
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DocCategory } from '@/lib/docs/types'
import { Formatter } from '@/lib/utils/formatting'
import { logger } from '@/lib/utils/logger'

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

export default async function ItemPage({
  params
}: {
  params: Promise<{ category: string; item: string }>
}) {
  const { category, item: itemName } = await params
  const sections = await loadDocumentation()
  const categoryName = Formatter.capitalize(category)
  const section = sections.find(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  )

  if (!section) {
    notFound()
  }

  const item = section.items.find((i) => i.name === itemName)

  if (!item) {
    notFound()
  }

  let htmlContent: string | null = null
  let htmlError: string | null = null

  try {
    const htmlPath = getTypeDocHTMLPath(item)
    htmlContent = await extractTypeDocContent(htmlPath)
  } catch (error) {
    logger.error('Failed to load TypeDoc HTML', 'Docs', error)
    htmlError =
      error instanceof Error
        ? error.message
        : 'Unknown error loading documentation'
  }

  const Icon = categoryIcons[section.category]

  const relatedItems = section.items
    .filter((i) => i.id !== item.id && i.kind === item.kind)
    .slice(0, 5)

  return (
    <PageShell variant="centered" maxWidth="7xl">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
        <Link
          href="/docs"
          className="flex items-center gap-1 transition-colors hover:text-gray-300"
        >
          <Home className="h-4 w-4" />
          Docs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/docs/${category}`}
          className="transition-colors hover:text-gray-300"
        >
          {categoryName}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-300">{item.name}</span>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="rounded-lg border-2 border-gray-700 bg-gray-900/30 p-8">
            {htmlError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-sm text-red-400">
                  Failed to load documentation: {htmlError}
                </p>
                <p className="mt-2 text-xs text-red-400/70">
                  This may be because the TypeDoc HTML file could not be found
                  or parsed.
                </p>
              </div>
            ) : (
              <div
                className="typedoc-content"
                dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 lg:shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Category Info */}
            <div className="rounded-lg border-2 border-gray-700 bg-gray-900/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-200">Category</h3>
              </div>
              <Link
                href={`/docs/${category}`}
                className="block rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700"
              >
                {categoryName}
              </Link>
            </div>

            {/* View Full TypeDoc */}
            <div className="rounded-lg border-2 border-gray-700 bg-gray-900/50 p-4">
              <h3 className="mb-3 font-semibold text-gray-200">
                Full Documentation
              </h3>
              <a
                href={`/docs/html/${htmlContent ? getTypeDocHTMLPath(item) : '#'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700"
              >
                <ExternalLink className="h-4 w-4" />
                View in TypeDoc
              </a>
            </div>

            {/* Source Location */}
            {item.source && (
              <div className="rounded-lg border-2 border-gray-700 bg-gray-900/50 p-4">
                <h3 className="mb-3 font-semibold text-gray-200">Source</h3>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-400">
                    <span className="text-gray-500">File:</span>{' '}
                    <code className="rounded bg-gray-800 px-1 py-0.5 font-mono text-xs text-gray-300">
                      {item.source.file}
                    </code>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Line:</span>{' '}
                    {item.source.line}
                  </div>
                </div>
              </div>
            )}

            {/* Related Items */}
            {relatedItems.length > 0 && (
              <div className="rounded-lg border-2 border-gray-700 bg-gray-900/50 p-4">
                <h3 className="mb-3 font-semibold text-gray-200">
                  Related {Formatter.capitalize(item.kind)}s
                </h3>
                <div className="space-y-1">
                  {relatedItems.map((related) => (
                    <Link
                      key={related.id}
                      href={`/docs/${category}/${related.name}`}
                      className="block rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-300"
                    >
                      {related.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="rounded-lg border-2 border-gray-700 bg-gray-900/50 p-4">
                <h3 className="mb-3 font-semibold text-gray-200">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
