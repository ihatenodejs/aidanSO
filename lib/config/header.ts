import {
  House,
  Link as LinkIcon,
  User,
  Phone,
  BookOpen,
  Brain,
  Smartphone,
  Headphones,
  Briefcase,
  Package,
  Cloud,
  FileText,
  ChartLine,
  BriefcaseBusiness,
  Activity,
  Bot
} from 'lucide-react'
import { TbUser } from 'react-icons/tb'
import KowalskiIcon from '@/components/icons/KowalskiIcon'
import GoogleIcon from '@/components/icons/GoogleIcon'

import type { NavigationMenuItem } from '@/lib/types/navigation'

export const headerNavigationConfig: NavigationMenuItem[] = [
  {
    type: 'link',
    id: 'home',
    label: 'Home',
    href: '/',
    icon: House
  },
  {
    type: 'dropdown',
    id: 'about',
    label: 'About Me',
    href: '/about',
    icon: User,
    dropdown: {
      items: [
        {
          type: 'link',
          label: 'About',
          href: '/about',
          icon: TbUser
        },
        {
          type: 'nested',
          label: 'Devices',
          href: '/devices',
          icon: Smartphone,
          groups: [
            {
              title: 'Phones',
              links: [
                {
                  type: 'link',
                  label: 'Pixel 3a XL (bonito)',
                  href: '/device/bonito',
                  icon: GoogleIcon
                },
                {
                  type: 'link',
                  label: 'Pixel 7 Pro (cheetah)',
                  href: '/device/cheetah',
                  icon: GoogleIcon
                },
                {
                  type: 'link',
                  label: 'Pixel 9 Pro (komodo)',
                  href: '/device/komodo',
                  icon: GoogleIcon
                }
              ]
            },
            {
              title: 'DAPs',
              links: [
                {
                  type: 'link',
                  label: 'FiiO JM21',
                  href: '/device/jm21',
                  icon: Headphones
                }
              ]
            }
          ]
        },
        {
          type: 'nested',
          label: 'Projects',
          icon: Briefcase,
          groups: [
            {
              title: '',
              links: [
                {
                  type: 'link',
                  label: 'modules',
                  href: 'https://modules.lol/',
                  icon: Package,
                  external: true
                },
                {
                  type: 'link',
                  label: 'agent-exporter',
                  href: 'https://npmjs.com/package/agent-exporter',
                  icon: Bot,
                  external: true
                },
                {
                  type: 'link',
                  label: 'Kowalski',
                  href: 'https://kowalski.social/',
                  icon: KowalskiIcon,
                  external: true
                },
                {
                  type: 'link',
                  label: 'LibreCloud',
                  href: 'https://github.com/ihatenodejs/librecloud-web/',
                  icon: Cloud,
                  external: true
                },
                {
                  type: 'link',
                  label: 'p0ntus',
                  href: 'https://p0ntus.com/',
                  icon: Cloud,
                  external: true
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    type: 'dropdown',
    id: 'ai',
    label: 'AI',
    href: '/ai',
    icon: Brain,
    dropdown: {
      items: [
        {
          type: 'link',
          label: 'Usage',
          href: '/ai/usage',
          icon: ChartLine
        }
      ]
    }
  },
  {
    type: 'dropdown',
    id: 'resources',
    label: 'Resources',
    icon: BriefcaseBusiness,
    dropdown: {
      items: [
        {
          type: 'link',
          label: 'Docs',
          href: '/docs',
          icon: FileText
        },
        {
          type: 'link',
          label: 'Status',
          href: '/status',
          icon: Activity
        },
        {
          type: 'link',
          label: 'My Domains',
          href: '/domains',
          icon: LinkIcon
        },
        {
          type: 'link',
          label: 'Manifesto',
          href: '/manifesto',
          icon: BookOpen
        }
      ]
    }
  },
  {
    type: 'link',
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    icon: Phone
  }
]
