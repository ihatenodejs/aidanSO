import type { NavigationIcon } from '@/lib/types/navigation'
import { CreditCard, PillBottle, Scale } from 'lucide-react'
import { BsArrowClockwise } from 'react-icons/bs'
import { FaHandcuffs } from 'react-icons/fa6'
import { SiGithubsponsors } from 'react-icons/si'

export type DonationGroupId = 'charity' | 'me'

export type DonationLink = {
  id: string
  label: string
  href: string
  icon: NavigationIcon
  external?: boolean
  target?: '_blank' | '_self'
  groupId: DonationGroupId
}

export type DonationGroup = {
  id: DonationGroupId
  title: string
  links: DonationLink[]
}

export const donationGroups: DonationGroup[] = [
  {
    id: 'charity',
    title: 'Charities',
    links: [
      {
        id: 'unsilenced',
        label: 'Unsilenced',
        href: 'https://unsilenced.org',
        icon: FaHandcuffs,
        external: true,
        target: '_blank',
        groupId: 'charity'
      },
      {
        id: 'drug-policy-alliance',
        label: 'Drug Policy Alliance',
        href: 'https://drugpolicy.org',
        icon: PillBottle,
        external: true,
        target: '_blank',
        groupId: 'charity'
      },
      {
        id: 'aclu',
        label: 'ACLU',
        href: 'https://www.aclu.org',
        icon: Scale,
        external: true,
        target: '_blank',
        groupId: 'charity'
      },
      {
        id: 'epic-restart-foundation',
        label: 'EPIC Restart Foundation',
        href: 'https://www.epicrestartfoundation.org',
        icon: BsArrowClockwise,
        external: true,
        target: '_blank',
        groupId: 'charity'
      }
    ]
  },
  {
    id: 'me',
    title: 'Donate to Me',
    links: [
      {
        id: 'stripe',
        label: 'Stripe',
        href: 'https://donate.stripe.com/6oEeWVcXs9L9ctW4gj',
        icon: CreditCard,
        external: true,
        target: '_blank',
        groupId: 'me'
      },
      {
        id: 'github-sponsors',
        label: 'GitHub Sponsors',
        href: 'https://github.com/sponsors/ihatenodejs',
        icon: SiGithubsponsors,
        external: true,
        target: '_blank',
        groupId: 'me'
      }
    ]
  }
]

export const getDonationGroups = (
  ids?: ReadonlyArray<DonationGroupId>
): DonationGroup[] => {
  if (!ids) {
    return donationGroups
  }

  const uniqueIds = Array.from(new Set(ids))

  return uniqueIds
    .map((id) => donationGroups.find((group) => group.id === id))
    .filter((group): group is DonationGroup => Boolean(group))
}
