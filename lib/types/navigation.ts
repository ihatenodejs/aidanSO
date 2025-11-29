import type { ComponentType, ReactNode } from 'react'

import type { GitHubRepoSummary } from '@/lib/github'

export type NavigationIcon = ComponentType<
  { className?: string; size?: number } & Record<string, unknown>
>

export type NavigationLink = {
  label: string
  href: string
  icon: NavigationIcon
  external?: boolean
}

export type NavigationDropdownLinkItem = NavigationLink & {
  type: 'link'
}

export type NavigationDropdownGroup = {
  title: string
  links: NavigationDropdownLinkItem[]
}

export type NavigationDropdownNestedItem = {
  type: 'nested'
  label: string
  href?: string
  icon: NavigationIcon
  groups: NavigationDropdownGroup[]
}

export type NavigationDropdownItem =
  | NavigationDropdownLinkItem
  | NavigationDropdownNestedItem

export type NavigationDropdownConfig = {
  items: NavigationDropdownItem[]
}

export type NavigationMenuLinkItem = NavigationLink & {
  type: 'link'
  id: string
}

export type NavigationMenuDropdownItem = {
  type: 'dropdown'
  id: string
  label: string
  href?: string
  icon: NavigationIcon
  dropdown: NavigationDropdownConfig
}

export type NavigationMenuItem =
  | NavigationMenuLinkItem
  | NavigationMenuDropdownItem

export type FooterMenuRenderContext = {
  githubUsername: string
  githubRepos: GitHubRepoSummary[]
}

export type FooterMenuSection =
  | {
      type: 'links'
      title: string
      links: NavigationLink[]
    }
  | {
      type: 'custom'
      title: string
      render: (context: FooterMenuRenderContext) => ReactNode
    }
