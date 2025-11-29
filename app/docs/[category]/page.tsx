import { loadDocumentation } from '@/lib/docs/loader'
import PageShell from '@/components/layout/PageShell'
import PageHeader from '@/components/objects/PageHeader'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import CategoryPageClient from './CategoryPageClient'
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
import type { DocCategory, DocKind } from '@/lib/docs/types'
import { Formatter } from '@/lib/utils/formatting'

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

export const kindColors: Record<DocKind, string> = {
  function: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  method: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  class: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  interface: 'bg-green-500/10 text-green-400 border-green-500/20',
  type: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  variable: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  property: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  enum: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const sections = await loadDocumentation()
  const categoryName = Formatter.capitalize(category)
  const section = sections.find(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  )

  if (!section) {
    notFound()
  }

  const Icon = categoryIcons[section.category]

  const availableKinds = Array.from(
    new Set(section.items.map((item) => item.kind))
  ).sort()

  const stats = {
    total: section.items.length,
    functions: section.items.filter(
      (i) => i.kind === 'function' || i.kind === 'method'
    ).length,
    types: section.items.filter(
      (i) => i.kind === 'type' || i.kind === 'interface'
    ).length,
    other: section.items.filter(
      (i) =>
        i.kind !== 'function' &&
        i.kind !== 'method' &&
        i.kind !== 'type' &&
        i.kind !== 'interface'
    ).length
  }

  return (
    <PageShell variant="centered" maxWidth="7xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link
          href="/docs"
          className="flex items-center gap-1 transition-colors hover:text-gray-300"
        >
          <Home className="h-4 w-4" />
          Docs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-300">{categoryName}</span>
      </div>

      <div className="flex flex-col items-center text-center">
        <PageHeader icon={<Icon size={60} />} title={categoryName} />

        <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500">Items</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {stats.functions}
            </div>
            <div className="text-sm text-gray-500">Functions</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {stats.types}
            </div>
            <div className="text-sm text-gray-500">Types</div>
          </div>
          <div className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
            <div className="text-2xl font-bold text-gray-300">
              {stats.other}
            </div>
            <div className="text-sm text-gray-500">Other</div>
          </div>
        </div>
      </div>

      <CategoryPageClient
        category={category}
        items={section.items}
        availableKinds={availableKinds}
        kindColors={kindColors}
      />
    </PageShell>
  )
}
