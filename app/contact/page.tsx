'use client'

import Button from '@/components/objects/Button'
import PageHeader from '@/components/objects/PageHeader'
import PageShell from '@/components/layout/PageShell'
import { getContactLinks } from '@/lib/config/contact'
import { Phone } from 'lucide-react'

interface ContactSection {
  title: string
  texts: string[]
}

export default function Contact() {
  const sections: ContactSection[] = [
    {
      title: "I'm a busy person",
      texts: [
        "I'm busy most of the time, so please be patient and understanding of my workload. I can tend to be offline for a few days when I'm busy, but I will respond as soon as I can.",
        "For the best chance of a response, please send me a message on Telegram. If you've made a pull request on one of my repos, I will most likely respond by the next day. If you've sent me an email, I will most likely respond within three days or less."
      ]
    }
  ]

  const contactLinks = getContactLinks()

  return (
    <PageShell variant="centered" maxWidth="2xl" innerClassName="text-center">
      <PageHeader icon={<Phone size={60} />} title="Contact" />

      <div className="flex flex-wrap justify-center gap-3">
        {contactLinks.map((contact) => {
          const Icon = contact.icon
          const target =
            contact.target ?? (contact.external ? '_blank' : undefined)

          return (
            <Button
              key={contact.id}
              href={contact.href}
              target={target}
              variant="rounded"
              icon={<Icon size={18} />}
            >
              {contact.label}
            </Button>
          )
        })}
      </div>

      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-200">
            {section.title}
          </h2>
          {section.texts.map((text, index) => (
            <p key={index} className="text-gray-300">
              {text}
            </p>
          ))}
        </div>
      ))}
    </PageShell>
  )
}
