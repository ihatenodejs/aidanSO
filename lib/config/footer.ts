import { Brain, House, Phone, User } from 'lucide-react'

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
    href: '/manifesto',
    label: 'AI',
    icon: Brain
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: Phone
  }
]

export const FOOTER_CONTACT_LINK_IDS = ['github', 'telegram', 'email'] as const

export const FOOTER_DONATION_GROUP_IDS = ['me'] as const

export const FOOTER_ROLE = 'Full-Stack Developer'

export const FOOTER_DESCRIPTION = 'Open source developer and sysadmin.'
