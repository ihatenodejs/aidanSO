import {
  House,
  User,
  Phone,
  BookOpen,
  CreditCard,
} from 'lucide-react'
import type { NavigationLink } from '@/lib/types/navigation'
import { SiGithubsponsors } from 'react-icons/si'

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
  },
]

export const footerSupportLinks: NavigationLink[] = [
  {
    href: 'https://donate.stripe.com/6oEeWVcXs9L9ctW4gj',
    label: 'Donate via Stripe',
    icon: CreditCard,
    external: true,
  },
  {
    href: 'https://github.com/sponsors/ihatenodejs',
    label: 'GitHub Sponsors',
    icon: SiGithubsponsors,
    external: true,
  },
]
