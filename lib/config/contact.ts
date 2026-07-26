import type { NavigationIcon } from '@/lib/types/navigation'
import { TbBrandGithub, TbMail, TbPhone } from 'react-icons/tb'
import { SiForgejo } from 'react-icons/si'
import { RiTelegram2Line } from 'react-icons/ri'

export type ContactLink = {
  id: string
  label: string
  href: string
  icon: NavigationIcon
  ariaLabel: string
  external?: boolean
  target?: '_blank' | '_self'
}

export const contactLinks: ContactLink[] = [
  {
    id: 'github',
    label: 'ihatenodejs',
    href: 'https://github.com/ihatenodejs',
    icon: TbBrandGithub,
    ariaLabel: 'GitHub',
    external: true,
    target: '_blank'
  },
  {
    id: 'forgejo',
    label: 'aidan',
    href: 'https://git.p0ntus.com/aidan',
    icon: SiForgejo,
    ariaLabel: 'Forgejo',
    external: true,
    target: '_blank'
  },
  {
    id: 'telegram',
    label: '@p0ntu5',
    href: 'https://t.me/p0ntu5',
    icon: RiTelegram2Line,
    ariaLabel: 'Telegram',
    external: true,
    target: '_blank'
  },
  {
    id: 'phone',
    label: '+1 332-292-7272',
    href: 'tel:+13322927272',
    icon: TbPhone,
    ariaLabel: 'Phone',
    target: '_self'
  },
  {
    id: 'email',
    label: 'aidan@p0ntus.com',
    href: 'mailto:aidan@p0ntus.com',
    icon: TbMail,
    ariaLabel: 'Email',
    target: '_self'
  }
]

export const getContactLinks = (ids?: ReadonlyArray<ContactLink['id']>) => {
  if (!ids) {
    return contactLinks
  }

  const uniqueIds = Array.from(new Set(ids))

  return uniqueIds
    .map((id) => contactLinks.find((link) => link.id === id))
    .filter((link): link is ContactLink => Boolean(link))
}
