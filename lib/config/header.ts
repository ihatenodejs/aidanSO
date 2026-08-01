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
  ChartLine,
  BriefcaseBusiness,
  Activity,
  Bot,
  Trophy
} from 'lucide-react'
import { TbUser, TbDeviceGamepad2, TbBowlSpoon } from 'react-icons/tb'
import KowalskiIcon from '@/components/icons/KowalskiIcon'
import CommandCodeIcon from '@/components/icons/CommandCodeIcon'
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
                  href: 'https://modules.aidan.so',
                  icon: Package,
                  external: true
                },
                {
                  type: 'link',
                  label: 'commandcode-proxy',
                  href: 'https://github.com/ihatenodejs/commandcode-proxy',
                  icon: CommandCodeIcon,
                  external: true
                },
                {
                  type: 'link',
                  label: 'p0ntus',
                  href: 'https://p0ntus.com/',
                  icon: TbDeviceGamepad2,
                  external: true
                },
                {
                  type: 'link',
                  label: 'cereal',
                  href: 'https://github.com/ihatenodejs/cereal',
                  icon: TbBowlSpoon,
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
                  href: 'https://github.com/abocn/TelegramBot',
                  icon: KowalskiIcon,
                  external: true
                },
                {
                  type: 'link',
                  label: 'LibreCloud',
                  href: 'https://github.com/ihatenodejs/librecloud-web/',
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
          label: 'Ranking',
          href: '/ai',
          icon: Trophy
        },
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
    href: '/status',
    icon: BriefcaseBusiness,
    dropdown: {
      items: [
        {
          type: 'link',
          label: 'Status',
          href: '/status',
          icon: Activity
        },
        {
          type: 'link',
          label: 'Domains',
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
