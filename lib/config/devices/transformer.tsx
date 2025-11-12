/**
 * Transforms TSX device page components into DeviceSpec data structure
 */

import { Children, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import type {
  DeviceSpec,
  DeviceSection,
  DeviceSectionRow,
  DeviceSectionListItem
} from '@/lib/types'
import type {
  ModuleProps,
  ModulesProps,
  ParagraphProps,
  ParagraphsProps,
  RowProps,
  SectionProps
} from './components'

/**
 * Represents a device page module with metadata and content component.
 * @category Device Configuration
 * @public
 */
export interface DevicePageModule {
  meta: Omit<DeviceSpec, 'stats' | 'sections'>
  Content: () => ReactElement
}

function getProps<P>(element: ReactElement): P {
  return element.props as P
}

type NamedComponent = {
  displayName?: string
  name?: string
}

function getComponentName(element: ReactElement): string | undefined {
  const elementType = element.type

  if (typeof elementType === 'string') {
    return elementType
  }

  if (typeof elementType === 'function' || typeof elementType === 'object') {
    const named = elementType as NamedComponent
    return named.displayName ?? named.name
  }

  return undefined
}

function isElementNamed<P>(
  node: ReactNode,
  name: string
): node is ReactElement<P> {
  if (!isValidElement(node)) return false
  return getComponentName(node) === name
}

/**
 * Transforms a device page module (meta + Content component) into a DeviceSpec
 */
export function transformDevicePage(module: DevicePageModule): DeviceSpec {
  const content = module.Content()
  const sections = extractSections(content)

  return {
    ...module.meta,
    stats: [],
    sections
  }
}

/**
 * Extracts sections from the Content JSX tree
 */
function extractSections(content: ReactElement): DeviceSection[] {
  const sections: DeviceSection[] = []
  const props = getProps<{ children?: ReactNode }>(content)
  const children = Children.toArray(props.children)

  for (const child of children) {
    if (isElementNamed<SectionProps>(child, 'Section')) {
      sections.push(extractSection(child))
      continue
    }

    if (isElementNamed<ModulesProps>(child, 'Modules')) {
      sections.push(extractModulesSection(child))
      continue
    }

    if (isElementNamed<ParagraphsProps>(child, 'Paragraphs')) {
      sections.push(extractParagraphsSection(child))
    }
  }

  return sections
}

/**
 * Extracts a standard section with rows
 */
function extractSection(element: ReactElement<SectionProps>): DeviceSection {
  const { id, title, icon, children } = getProps<SectionProps>(element)

  const rows: DeviceSectionRow[] = []
  const childArray = Children.toArray(children)

  for (const child of childArray) {
    if (!isElementNamed<RowProps>(child, 'Row')) continue

    const { label, value, icon, href, note, filterValue } =
      getProps<RowProps>(child)
    rows.push({ label, value, icon, href, note, filterValue })
  }

  return {
    id,
    title,
    icon,
    rows
  }
}

/**
 * Extracts a modules/list section
 */
function extractModulesSection(
  element: ReactElement<ModulesProps>
): DeviceSection {
  const { id, title, icon, children } = getProps<ModulesProps>(element)

  const listItems: DeviceSectionListItem[] = []
  const childArray = Children.toArray(children)

  for (const child of childArray) {
    if (!isElementNamed<ModuleProps>(child, 'Module')) continue

    const { label, href, description } = getProps<ModuleProps>(child)
    listItems.push({ label, href, description })
  }

  return {
    id,
    title,
    icon,
    listItems
  }
}

/**
 * Extracts a paragraphs section (like reviews)
 */
function extractParagraphsSection(
  element: ReactElement<ParagraphsProps>
): DeviceSection {
  const { id, title, icon, rating, children } =
    getProps<ParagraphsProps>(element)

  const paragraphs: string[] = []
  const childArray = Children.toArray(children)

  for (const child of childArray) {
    if (!isElementNamed<ParagraphProps>(child, 'Paragraph')) continue

    const text = getProps<ParagraphProps>(child).children
    if (typeof text === 'string') {
      paragraphs.push(text)
    }
  }

  return {
    id,
    title,
    icon,
    paragraphs,
    rating
  }
}
