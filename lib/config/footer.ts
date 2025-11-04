import { BookOpen, House, Phone, User } from 'lucide-react'

import type { NavigationLink } from '@/lib/types/navigation'

export const footerNavigationLinks: NavigationLink[] = [
  {
    href: '/',
    label: 'Home',
    icon: House
  },
  {
    href: '/about',
    label: 'About Me',
    icon: User
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: Phone
  },
  {
    href: '/manifesto',
    label: 'Manifesto',
    icon: BookOpen
  }
]

export const FOOTER_CONTACT_LINK_IDS = [
  'github',
  'matrix',
  'telegram',
  'email'
] as const

export const FOOTER_DONATION_GROUP_IDS = ['me'] as const

export const FOOTER_ROLES = [
  'Chief Synergy Evangelist',
  'Vice President of Change Management',
  'Global KPI Whisperer',
  'Head of Agile Communications',
  'VP of Continuous Optimization',
  'Principal Narrative Architect',
  'Lead Alignment Strategist',
  'Chief Risk Mitigator',
  'Director of Value Realization',
  'AI Synergest'
] as const

export const FOOTER_DESCRIPTION = 'Open source developer and sysadmin.'
