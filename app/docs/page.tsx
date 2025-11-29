import { loadDocumentation } from '@/lib/docs/loader'
import PageShell from '@/components/layout/PageShell'
import PageHeader from '@/components/objects/PageHeader'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import {
  Settings,
  Wrench,
  FileText,
  Palette,
  Globe,
  Package,
  Sliders,
  Smartphone,
  Network
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DocCategory } from '@/lib/docs/types'

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

const categoryDescriptions: Record<DocCategory, string> = {
  Services:
    'Business logic services for data operations, domain management, and AI analytics',
  Utils: 'Utility functions for formatting, validation, and common operations',
  Types:
    'TypeScript type definitions and interfaces used throughout the codebase',
  Theme: 'Design tokens, colors, surfaces, and theming utilities',
  Devices: 'Device configuration, data processing, and showcase utilities',
  Domains: 'Domain portfolio management, filtering, and analytics',
  Configuration: 'Application configuration files and constants',
  Docs: 'Documentation generation and parsing utilities',
  API: 'API routes, endpoints, and server-side logic',
  Other: 'Miscellaneous utilities and helpers'
}

export default async function DocsPage() {
  const sections = await loadDocumentation()

  const totalItems = sections.reduce(
    (acc, section) => acc + section.items.length,
    0
  )

  return (
    <PageShell variant="centered" maxWidth="7xl">
      <div className="flex flex-col items-center text-center">
        <PageHeader icon={<BookOpen size={60} />} title="Documentation" />
        <p className="mt-4 max-w-2xl text-center text-lg text-gray-400">
          Browse functions, types, utilities, and services.
        </p>
        <div className="mt-4">
          <Link
            href="/docs/typedoc"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800"
          >
            <FileText className="h-4 w-4" />
            View TypeDoc
          </Link>
        </div>

        <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {sections.length}
            </div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">{totalItems}</div>
            <div className="text-sm text-gray-500">Items</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {
                sections.filter((s) =>
                  s.items.some(
                    (i) => i.kind === 'function' || i.kind === 'method'
                  )
                ).length
              }
            </div>
            <div className="text-sm text-gray-500">Function Categories</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {
                sections.filter((s) =>
                  s.items.some(
                    (i) => i.kind === 'type' || i.kind === 'interface'
                  )
                ).length
              }
            </div>
            <div className="text-sm text-gray-500">Type Categories</div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = categoryIcons[section.category]
          const description = categoryDescriptions[section.category]

          return (
            <Link
              key={section.category}
              href={`/docs/${section.category.toLowerCase()}`}
              className="group rounded-lg border-2 border-gray-700 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-gray-600"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-800 transition-colors duration-300 group-hover:bg-gray-700">
                  <Icon className="h-6 w-6 text-gray-400 transition-colors duration-300 group-hover:text-gray-300" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 text-xl font-semibold text-gray-200 transition-colors duration-300 group-hover:text-gray-100">
                    {section.title}
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                    {description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-800 px-2 py-1">
                      {section.items.length} items
                    </span>
                    <span className="rounded-full bg-gray-800 px-2 py-1">
                      {
                        section.items.filter(
                          (i) => i.kind === 'function' || i.kind === 'method'
                        ).length
                      }{' '}
                      functions
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
