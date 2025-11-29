'use client'

import Button from '@/components/objects/Button'
import PageShell from '@/components/layout/PageShell'
import LastPlayed from '@/components/widgets/NowPlaying'
import LiveIndicator from '@/components/widgets/LiveIndicator'
import DeviceShowcase from '@/components/widgets/DeviceShowcase'
import ProfilePicture from '@/components/objects/ProfilePicture'
import { getDonationGroups } from '@/lib/config/donations'
import { getContactLinks } from '@/lib/config/contact'

import { UserCircle } from 'lucide-react'
import {
  SiNextdotjs,
  SiTailwindcss,
  SiDocker,
  SiLinux,
  SiTypescript,
  SiClaude,
  SiPostgresql,
  SiOpenai
} from 'react-icons/si'

import { TbUserHeart, TbMessage } from 'react-icons/tb'
import { BiDonateHeart } from 'react-icons/bi'

export default function Home() {
  const mainStrings: string[][] = [
    [
      "Hey there! My name is Aidan, and I'm a systems administrator, developer, and student from the Boston area. I primarily work with Linux, Docker, Next.js, Tailwind CSS and TypeScript.",
      "I'm a huge advocate for AI and its practical applications in coding and life itself. While I love open-weight models, I prefer and use Claude for most of my work. I integrate LLMs with my workflow to improve my efficency and leave more time for ideation and creativity.",
      "And if you can't already tell, I'm a huge fan of the public domain and open-source software in general. You can find most of my projects released into the public domain.",
      "When I'm not coding, you can find me listening to music, walking the streets, getting stuck in my thoughts, watching ice hockey, trading prediction markets, and/or smoking."
    ],
    [
      'I create primarily web-based projects with Next.js, Tailwind CSS and TypeScript. Mixing in my system administration skills, I frequently create tools and services that turn scary data and/or commands into a polished tool for your browser.',
      'I also manage a dedicated server in Germany, used as a mailserver (against my better judgement) and other self-hosted services.',
      'My biggest project is p0ntus, a cloud services provider which I self-host and maintain. It features most services you would find from large companies like Google, although everything is free and open-source.'
    ]
  ]

  const mainSections = ['Who I am', 'What I do']
  const donationGroups = getDonationGroups()
  const contactLinks = getContactLinks()

  return (
    <PageShell variant="full-width">
      <div className="my-12 text-center">
        <ProfilePicture
          alt="My Profile Picture"
          size={150}
          borderWidth="4"
          className="mx-auto mb-6"
        />
        <h1 className="glow mb-2 text-4xl font-bold text-gray-100">
          Aidan Honor
        </h1>
        <p className="text-xl text-gray-400">
          SysAdmin, Developer, and Student
        </p>
      </div>

      <div className="-mb-6 grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="relative rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
          <div className="absolute top-2 right-2">
            <LiveIndicator />
          </div>
          <div className="flex h-full items-center justify-center">
            <LastPlayed />
          </div>
        </div>

        {mainSections.map((section, secIndex) => (
          <section
            key={secIndex}
            className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-8"
          >
            <h2 className="mb-4 text-2xl font-semibold text-gray-200">
              {section === 'Who I am' ? (
                <div className="flex flex-row items-center gap-2">
                  <UserCircle className="h-6 w-6" />
                  <span className="align-middle">{section}</span>
                </div>
              ) : section === 'What I do' ? (
                <div className="flex flex-row items-center gap-2">
                  <TbUserHeart className="h-6 w-6" />
                  <span className="align-middle">{section}</span>
                </div>
              ) : (
                section
              )}
            </h2>
            {section === 'What I do' && (
              <div className="my-8 flex flex-row items-center justify-center gap-4">
                <SiNextdotjs size={38} />
                <SiTypescript size={38} />
                <SiTailwindcss size={38} />
                <SiPostgresql size={38} />
                <SiDocker size={38} />
                <SiLinux size={38} />
                <SiClaude size={38} />
                <SiOpenai size={38} />
              </div>
            )}
            {mainStrings[secIndex].map((text: string, index: number) => (
              <p key={index} className="mt-2 leading-relaxed text-gray-300">
                {text}
              </p>
            ))}
          </section>
        ))}

        <section className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-8">
          <DeviceShowcase />
        </section>

        <section
          id="contact"
          className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-8"
        >
          <h2 className="mb-4 flex flex-row items-center gap-2 text-2xl font-semibold text-gray-200">
            <TbMessage />
            Send me a message
          </h2>
          <p className="mb-6 text-gray-300">
            Feel free to reach out for feedback, collaborations, or just a
            hello! I aim to answer all of my messages in a timely fashion, but
            please have patience.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {contactLinks.map((contact) => {
              const Icon = contact.icon
              const target =
                contact.target ?? (contact.external ? '_blank' : undefined)

              return (
                <a
                  key={contact.id}
                  href={contact.href}
                  target={target}
                  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                  aria-label={contact.ariaLabel}
                  className="group relative flex flex-col items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all duration-300 hover:scale-105 hover:border-gray-600 hover:bg-gray-700/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700/50 transition-colors duration-300 group-hover:bg-gray-600/50">
                    <Icon
                      size={24}
                      className="text-gray-300 transition-colors duration-300 group-hover:text-gray-200"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                      {contact.ariaLabel}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-300">
                      {contact.label}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        <section
          id="donation"
          className="rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600 sm:p-8"
        >
          <h2 className="mb-4 flex flex-row items-center gap-2 text-2xl font-semibold text-gray-200">
            <BiDonateHeart />
            Support my work
          </h2>
          <p className="mb-6 text-gray-300">
            Feeling generous? Support me or one of the causes I support!
          </p>
          {donationGroups.map((group, index) => (
            <div
              key={group.id}
              className={`flex flex-col gap-4 ${index > 0 ? 'mt-4' : ''}`}
            >
              <h4 className="text-lg font-semibold text-gray-200">
                {group.title}
              </h4>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 md:text-sm">
                {group.links.map((link) => {
                  const Icon = link.icon
                  const target =
                    link.target ?? (link.external ? '_blank' : undefined)

                  return (
                    <Button
                      key={link.id}
                      href={link.href}
                      icon={<Icon size={16} />}
                      target={target}
                      className="w-full justify-start text-left text-sm sm:text-base"
                    >
                      {link.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  )
}
