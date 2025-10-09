import { loadDocumentation } from '@/lib/docs/loader'
import { buildNavigation, getAllItems } from '@/lib/docs/parser'
import DocsPageClient from './DocsPageClient'

export default function DocsPage() {
  const sections = loadDocumentation()
  const navigation = buildNavigation(sections)
  const allItems = getAllItems(sections)

  return <DocsPageClient navigation={navigation} allItems={allItems} />
}