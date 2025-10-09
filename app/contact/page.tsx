"use client"

import Button from '@/components/objects/Button'
import PageHeader from '@/components/objects/PageHeader'
import { Phone, Smartphone, Mail } from 'lucide-react'
import { SiGithub, SiForgejo, SiTelegram } from 'react-icons/si'

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

  const contactButtons = [
    { label: "ihatenodejs", href: "https://github.com/ihatenodejs", icon: SiGithub },
    { label: "aidan", href: "https://git.p0ntus.com/aidan", icon: SiForgejo },
    { label: "p0ntu5", href: "https://t.me/p0ntu5", icon: SiTelegram },
    { label: "+1 857-295-2295", href: "tel:+18572952295", icon: Smartphone },
    { label: "aidan@p0ntus.com", href: "mailto:aidan@p0ntus.com", icon: Mail }
  ]

  return (
    <div className="grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <PageHeader
            icon={<Phone size={60} />}
            title="Contact"
          />
          <div className="flex flex-col gap-8 mt-8">
            <div className="flex flex-wrap justify-center gap-3">
              {contactButtons.map((button) => (
                <Button
                  key={button.label}
                  href={button.href}
                  target="_blank"
                  variant="rounded"
                  icon={<button.icon />}
                >
                  {button.label}
                </Button>
              ))}
            </div>
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-gray-200">{section.title}</h2>
                {section.texts.map((text, index) => (
                  <p key={index} className="text-gray-300">{text}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}