import type { NavigationIcon } from '@/lib/types/navigation'
import {
  TbBrandGithub,
  TbBrandTelegram,
  TbBrandMatrix,
  TbMail,
  TbPhone
} from 'react-icons/tb'
import { SiForgejo } from 'react-icons/si'

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
    icon: TbBrandTelegram,
    ariaLabel: 'Telegram',
    external: true,
    target: '_blank'
  },
  {
    id: 'matrix',
    label: '@aidan:dontbeevil.lol',
    href: 'https://matrix.to/#/@aidan:dontbeevil.lol',
    icon: TbBrandMatrix,
    ariaLabel: 'Matrix',
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

/**
 * Retrieves contact links, optionally filtered by specific IDs.
 *
 * @remarks
 * Returns all configured contact links or a subset filtered by the provided IDs.
 * Used throughout the application to display contact information in headers,
 * footers, and contact pages.
 *
 * @param ids - Optional array of contact link IDs to filter by
 * @returns Array of contact link objects
 *
 * @example
 * ```ts
 * // Get all contact links
 * const allLinks = getContactLinks()
 *
 * // Get only specific links
 * const socialLinks = getContactLinks(['github', 'linkedin'])
 * ```
 *
 * @category Configuration
 * @public
 */
export const getContactLinks = (ids?: ReadonlyArray<ContactLink['id']>) => {
  if (!ids) {
    return contactLinks
  }

  const uniqueIds = Array.from(new Set(ids))

  return uniqueIds
    .map((id) => contactLinks.find((link) => link.id === id))
    .filter((link): link is ContactLink => Boolean(link))
}
