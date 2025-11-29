import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { TbBrandGithub, TbCopyrightOff } from 'react-icons/tb'

import RandomFooterMsg from '../../objects/RandomFooterMsg'
import { footerMessages } from '../../objects/footerMessages'
import ProfilePicture from '../../objects/ProfilePicture'

import { getContactLinks } from '@/lib/config/contact'
import { getDonationGroups } from '@/lib/config/donations'
import { getRecentGitHubRepos } from '@/lib/github'
import { colors, surfaces } from '@/lib/theme'
import type {
  FooterMenuRenderContext,
  FooterMenuSection,
  NavigationIcon,
  NavigationLink
} from '@/lib/types/navigation'
import { cn } from '@/lib/utils'

import {
  FOOTER_CONTACT_LINK_IDS,
  FOOTER_DESCRIPTION,
  FOOTER_DONATION_GROUP_IDS,
  FOOTER_ROLES,
  footerNavigationLinks
} from '../../../lib/config/footer'
import SystemStatusClient from './SystemStatusClient'
import type { FooterProps } from './types'

interface FooterLinkProps {
  href: string
  children: ReactNode
  external?: boolean
  icon?: NavigationIcon
}

const FooterLink = ({
  href,
  children,
  external = false,
  icon: Icon
}: FooterLinkProps) => {
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Link
      href={href}
      {...linkProps}
      className={cn(
        'group flex items-center transition-colors duration-300',
        'hover:text-white'
      )}
      style={{ color: colors.text.muted }}
    >
      {Icon && (
        <span className="mr-1.5 transition-transform group-hover:scale-110">
          <Icon size={14} />
        </span>
      )}
      {children}
      {external && (
        <ChevronRight
          size={14}
          className="ml-0.5 opacity-50 transition-opacity group-hover:opacity-100"
        />
      )}
    </Link>
  )
}

interface FooterSectionProps {
  title: string
  children: ReactNode
}

const FooterSection = ({ title, children }: FooterSectionProps) => (
  <div className="flex flex-col space-y-4">
    <h3
      className="text-sm font-semibold tracking-wider uppercase"
      style={{ color: colors.text.secondary }}
    >
      {title}
    </h3>
    <div className="flex flex-col space-y-2.5">{children}</div>
  </div>
)

const getRoleByIndex = (index: number | undefined): string => {
  if (
    !FOOTER_ROLES.length ||
    typeof index !== 'number' ||
    Number.isNaN(index)
  ) {
    return FOOTER_ROLES[0] ?? 'Chief Synergy Evangelist'
  }

  const safeIndex =
    ((Math.floor(index) % FOOTER_ROLES.length) + FOOTER_ROLES.length) %
    FOOTER_ROLES.length
  return (
    FOOTER_ROLES[safeIndex] ?? FOOTER_ROLES[0] ?? 'Chief Synergy Evangelist'
  )
}

export default async function Footer({
  footerMessageIndex = undefined,
  className
}: FooterProps) {
  const messageIndex =
    // eslint-disable-next-line react-hooks/purity -- Server component renders once per request
    footerMessageIndex ?? Math.floor(Math.random() * footerMessages.length)
  const role = getRoleByIndex(messageIndex)
  const { username: githubUsername, repos: githubRepos } =
    await getRecentGitHubRepos()
  const footerContactLinks = getContactLinks(FOOTER_CONTACT_LINK_IDS)
  const donationGroups = getDonationGroups(FOOTER_DONATION_GROUP_IDS)

  const supportLinks: NavigationLink[] = donationGroups.flatMap((group) =>
    group.links.map(({ label, href, icon, external }) => ({
      label,
      href,
      icon,
      external
    }))
  )

  const footerMenuSections: FooterMenuSection[] = [
    {
      type: 'links',
      title: 'Navigation',
      links: footerNavigationLinks
    },
    {
      type: 'custom',
      title: 'Latest Projects',
      render: ({ githubRepos, githubUsername }: FooterMenuRenderContext) =>
        githubRepos.length > 0 ? (
          githubRepos.map((repo) => (
            <FooterLink
              key={repo.id}
              href={repo.url}
              icon={TbBrandGithub}
              external
            >
              <span className="truncate" title={repo.name}>
                {repo.name}
              </span>
            </FooterLink>
          ))
        ) : (
          <FooterLink
            href={`https://github.com/${githubUsername}`}
            icon={TbBrandGithub}
            external
          >
            Projects unavailable — visit GitHub
          </FooterLink>
        )
    },
    {
      type: 'links',
      title: 'Support Me',
      links: supportLinks
    }
  ]

  return (
    <footer
      className={cn(surfaces.panel.overlay, 'mt-auto border-t', className)}
      style={{ color: colors.text.muted }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] lg:gap-x-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <ProfilePicture size={64} className="shrink-0" />
                <div className="min-w-0">
                  <h3
                    className="text-lg font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    Aidan Honor
                  </h3>
                  <p className="text-sm" style={{ color: colors.text.muted }}>
                    {role}
                  </p>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.text.muted }}
              >
                {FOOTER_DESCRIPTION}
              </p>

              <div className="flex items-center space-x-4 pt-2">
                {footerContactLinks.map((contact) => {
                  const Icon = contact.icon
                  const target =
                    contact.target ?? (contact.external ? '_blank' : undefined)
                  const href =
                    contact.id === 'github'
                      ? `https://github.com/${githubUsername}`
                      : contact.href

                  return (
                    <Link
                      key={contact.id}
                      href={href}
                      target={target}
                      rel={
                        target === '_blank' ? 'noopener noreferrer' : undefined
                      }
                      className="transition-colors hover:text-white"
                      style={{ color: colors.text.muted }}
                      aria-label={contact.ariaLabel}
                    >
                      <Icon size={20} />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {footerMenuSections.map((section) => (
            <FooterSection key={section.title} title={section.title}>
              {section.type === 'links'
                ? section.links.map(({ href, label, icon, external }) => (
                    <FooterLink
                      key={href}
                      href={href}
                      icon={icon}
                      external={external}
                    >
                      {label}
                    </FooterLink>
                  ))
                : section.render({ githubUsername, githubRepos })}
            </FooterSection>
          ))}
        </div>
      </div>

      <div
        className="border-t"
        style={{
          borderColor: colors.borders.muted,
          backgroundColor: colors.backgrounds.card
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 items-center gap-y-2 sm:grid-cols-[1fr_auto_1fr]">
            <div
              className="flex items-center justify-center text-sm sm:justify-start"
              style={{ color: colors.text.disabled }}
            >
              <TbCopyrightOff className="mr-2" size={16} />
              <span>Open Source and Copyright-Free</span>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm">
              <RandomFooterMsg index={messageIndex} />
            </div>

            <SystemStatusClient />
          </div>
        </div>
      </div>
    </footer>
  )
}
