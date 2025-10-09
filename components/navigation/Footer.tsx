import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  TbCopyrightOff,
  TbMail,
  TbBrandGithub,
  TbBrandX,
} from "react-icons/tb"
import { ChevronRight } from 'lucide-react'
import RandomFooterMsg from "../objects/RandomFooterMsg"
import { cn } from '@/lib/utils'
import { colors, surfaces } from '@/lib/theme'
import { getRecentGitHubRepos } from '@/lib/github'
import {
  footerNavigationLinks,
  footerSupportLinks,
} from './footer-config'
import type {
  FooterMenuRenderContext,
  FooterMenuSection,
  NavigationIcon,
} from '@/lib/types/navigation'

const FOOTER_MENU_SECTIONS: FooterMenuSection[] = [
  {
    type: 'links',
    title: 'Navigation',
    links: footerNavigationLinks,
  },
  {
    type: 'custom',
    title: 'Latest Projects',
    render: ({ githubRepos, githubUsername }: FooterMenuRenderContext) => (
      githubRepos.length > 0
        ? githubRepos.map((repo) => (
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
        : (
            <FooterLink
              href={`https://github.com/${githubUsername}`}
              icon={TbBrandGithub}
              external
            >
              Projects unavailable — visit GitHub
            </FooterLink>
          )
    ),
  },
  {
    type: 'links',
    title: 'Support Me',
    links: footerSupportLinks,
  },
]

interface FooterLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
  icon?: NavigationIcon
}

const FooterLink = ({ href, children, external = false, icon: Icon }: FooterLinkProps) => {
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <Link
      href={href}
      {...linkProps}
      className={cn(
        "flex items-center transition-colors duration-300 group",
        "hover:text-white"
      )}
      style={{ color: colors.text.muted }}
    >
      {Icon && (
        <span className="mr-1.5 group-hover:scale-110 transition-transform">
          <Icon size={14} />
        </span>
      )}
      {children}
      {external && <ChevronRight size={14} className="ml-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />}
    </Link>
  )
}

interface FooterSectionProps {
  title: string
  children: React.ReactNode
}

const FooterSection = ({ title, children }: FooterSectionProps) => (
  <div className="flex flex-col space-y-4">
    <h3
      className="font-semibold text-sm uppercase tracking-wider"
      style={{ color: colors.text.secondary }}
    >{title}</h3>
    <div className="flex flex-col space-y-2.5">
      {children}
    </div>
  </div>
)

type Persona = {
  role: string
  description: string
}

const personaOptions: Persona[] = [
  {
    role: 'Chief Synergy Evangelist',
    description: 'Drives enterprise-wide alignment through scalable cross-functional touchpoints.'
  },
  {
    role: 'Director of Strategic Buzzwords',
    description: 'Operationalizes high-impact vocabulary to maximize stakeholder resonance.'
  },
  {
    role: 'Vice President of Change Management',
    description: 'Leads transformational roadmaps that empower teams to pivot at scale.'
  },
  {
    role: 'Global KPI Whisperer',
    description: 'Ensures metric integrity through proactive dashboard storytelling.'
  },
  {
    role: 'Head of Agile Communications',
    description: 'Facilitates sprint cadence narratives for executive-level consumption.'
  },
  {
    role: 'VP of Continuous Optimization',
    description: 'Champions always-on iteration loops to unlock compounding efficiency gains.'
  },
  {
    role: 'Principal Narrative Architect',
    description: 'Synthesizes cross-team input into unified, board-ready success frameworks.'
  },
  {
    role: 'Lead Alignment Strategist',
    description: 'Converts strategic pivots into measurable OKR cascades and culture moments.'
  },
  {
    role: 'Chief Risk Mitigator',
    description: 'De-risks enterprise bets through proactive dependency orchestration.'
  },
  {
    role: 'Director of Value Realization',
    description: 'Translates initiatives into quantifiable ROI across all stakeholder tiers.'
  }
]

const defaultPersona: Persona = personaOptions[0] ?? {
  role: 'Developer & Creator',
  description: 'Building thoughtful digital experiences and exploring the intersection of technology, music, and creativity. Currently focused on web development and AI integration.'
}

const getPersonaByIndex = (index: number | undefined): Persona => {
  if (!personaOptions.length) {
    return defaultPersona
  }

  if (typeof index !== 'number' || Number.isNaN(index)) {
    return defaultPersona
  }

  const safeIndex = ((Math.floor(index) % personaOptions.length) + personaOptions.length) % personaOptions.length
  return personaOptions[safeIndex] ?? defaultPersona
}

interface FooterProps {
  footerMessageIndex?: number
}

export default async function Footer({ footerMessageIndex }: FooterProps) {
  const persona = getPersonaByIndex(footerMessageIndex)
  const { username: githubUsername, repos: githubRepos } = await getRecentGitHubRepos()

  return (
    <footer
      className={cn(surfaces.panel.overlay, "mt-auto border-t")}
      style={{ color: colors.text.muted }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] gap-x-10 gap-y-12 lg:gap-x-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div
                  className="relative w-16 h-16 rounded-full overflow-hidden ring-2"
                  style={{
                    backgroundColor: colors.borders.default,
                    borderColor: colors.borders.hover
                  }}
                >
                  <Image
                    src="/ihatenodejs.jpg"
                    alt="Aidan"
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: colors.text.primary }}
                  >Aidan</h3>
                  <p
                    className="text-sm"
                    style={{ color: colors.text.muted }}
                  >{persona.role}</p>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.text.muted }}
              >{persona.description}</p>

              <div className="flex items-center space-x-4 pt-2">
                <Link
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  style={{ color: colors.text.muted }}
                  aria-label="GitHub"
                >
                  <TbBrandGithub size={20} />
                </Link>
                <Link
                  href="https://x.com/aidxnn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  style={{ color: colors.text.muted }}
                  aria-label="X (Twitter)"
                >
                  <TbBrandX size={20} />
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                  style={{ color: colors.text.muted }}
                  aria-label="Email"
                >
                  <TbMail size={20} />
                </Link>
              </div>
            </div>
          </div>

          {FOOTER_MENU_SECTIONS.map((section) => (
            <FooterSection key={section.title} title={section.title}>
              {section.type === 'links'
                ? section.links.map(({ href, label, icon, external }) => (
                    <FooterLink key={href} href={href} icon={icon} external={external}>
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
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-y-2">
            <div
              className="flex items-center justify-center sm:justify-start text-sm"
              style={{ color: colors.text.disabled }}
            >
              <TbCopyrightOff className="mr-2" size={16} />
              <span>Open Source and Copyright-Free</span>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm">
              <RandomFooterMsg index={footerMessageIndex} />
            </div>

            {/* soon ->
            <div className="flex items-center justify-center sm:justify-end space-x-4 text-sm">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span style={{ color: colors.text.disabled }}>All Systems Operational</span>
              </span>
            </div>*/}<div></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
