import { loadDocumentation } from '@/lib/docs/loader'
import { buildNavigation, getAllItems } from '@/lib/docs/parser'
import DocsPageClient from './DocsPageClient'

export default function DocsPage() {
  const sections = loadDocumentation()
  const navigation = buildNavigation(sections)
  const items = getAllItems(sections)

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <DocsPageClient
        sections={sections}
        navigation={navigation}
        items={items}
      />
    </div>
  )
}
