"use client"

import Button from '@/components/objects/Button'
import LastPlayed from '@/components/widgets/NowPlaying'
import LiveIndicator from '@/components/widgets/LiveIndicator'

import Image from 'next/image'

import {CreditCard, Mail, PillBottle, Scale, UserCircle} from 'lucide-react'
import { BsArrowClockwise } from "react-icons/bs";
import { FaHandcuffs } from "react-icons/fa6"
import {
  SiGithubsponsors,
  SiNextdotjs,
  SiTailwindcss,
  SiDocker,
  SiLinux,
  SiTypescript,
  SiClaude,
  SiPostgresql
} from 'react-icons/si'

import {TbHeartHandshake, TbUserHeart, TbMessage} from "react-icons/tb";
import {BiDonateHeart} from "react-icons/bi";

export default function Home() {
  const mainStrings: string[][] = [
    [
      "Hey there! My name is Aidan, and I'm a systems administrator, full-stack developer, and student from the Boston area. I primarily work with Linux, Docker, Next.js, Tailwind CSS and TypeScript.",
      "My favorite projects and hobbies revolve around web development and SysAdmin. Most of my work is released into the public domain.",
      "I'm also a huge advocate for AI and it's practical applications to programming and life itself. I am fond of open-source models the most, specifically Qwen3!",
      "When I'm not programming, I can be found re-flashing my phone with a new custom ROM and jumping between projects. I tend to be quite depressed, but I make do."
    ],
    [
      "I'm at my best when I'm doing system administration and development in TypeScript. I frequently implement AI into my workflow.",
      "I manage three servers, including a mailserver (against my better judgement). I'm also crazy enough to self-host LLMs running on CPU.",
      "My biggest project is p0ntus, a cloud services provider which I self-host and maintain. It features most services you would find from large companies like Google, although everything is free and open-source."
    ],
    [
      "I am not here to brag about my accomplishments or plug my shitty SaaS. That's why I've made every effort to make this website as personal and fun as possible.",
      "I hope you find this website an interesting place to find more about me, but also learn something new; maybe inspire a new project or two.",
      "In a technical sense, this site is hosted on my dedicated server hosted in Buffalo, New York by ColoCrossing."
    ]
  ]

  const mainSections = [
    "Who I am",
    "What I do",
    "Where you are"
  ]

  return (
    <div className="w-full">
        <div className="my-12 text-center">
          <Image
            src="/ihatenodejs.jpg"
            alt="My Profile Picture"
            width={150}
            height={150}
            className="rounded-full mx-auto mb-6 border-4 border-gray-700 hover:border-gray-600 transition-colors duration-300"
          />
          <h1 className="text-4xl font-bold mb-2 text-gray-100 glow">Aidan Honor</h1>
          <p className="text-gray-400 text-xl">SysAdmin, Developer, and Student</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <div className="relative border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300 p-4">
            <div className="absolute top-2 right-2">
              <LiveIndicator />
            </div>
            <div className="flex justify-center items-center h-full">
              <LastPlayed />
            </div>
          </div>

          {mainSections.map((section, secIndex) => (
            <section key={secIndex} className="p-4 sm:p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">{section === "Where you are" ? (
                <div className="flex flex-row items-center gap-2">
                  <TbHeartHandshake />
                  <span className="align-middle">{section}</span>
                </div>
              ) : section === "Who I am" ? (
                <div className="flex flex-row items-center gap-2">
                  <UserCircle />
                  <span className="align-middle">{section}</span>
                </div>
              ) : section === "What I do" ? (
                <div className="flex flex-row items-center gap-2">
                  <TbUserHeart />
                  <span className="align-middle">{section}</span>
                </div>
              ) : (section)}</h2>
              {section === "What I do" && (
                <div className="flex flex-row items-center justify-center gap-4 my-8">
                  <SiNextdotjs size={38} />
                  <SiTypescript size={38} />
                  <SiTailwindcss size={38} />
                  <SiPostgresql size={38} />
                  <SiDocker size={38} />
                  <SiLinux size={38} />
                  <SiClaude size={38} />
                </div>
              )}
              {mainStrings[secIndex].map((text: string, index: number) => (
                <p key={index} className="text-gray-300 leading-relaxed mt-2">
                  {text}
                </p>
              ))}
            </section>
          ))}

          <section id="contact" className="p-4 sm:p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300">
            <h2 className="flex flex-row items-center gap-2 text-2xl font-semibold mb-4 text-gray-200">
              <TbMessage />
              Send me a message
            </h2>
            <p className="text-gray-300 mb-6">Feel free to reach out for feedback, collaborations, or just a hello! I aim to answer all of my messages in a timely fashion, but please have patience.</p>
            <Button
              href={'/contact'}
              icon={<Mail size={16} />}
            >
              Contact Me
            </Button>
          </section>

          <section id="donation" className="p-4 sm:p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300">
            <h2 className="flex flex-row items-center gap-2 text-2xl font-semibold mb-4 text-gray-200">
              <BiDonateHeart />
              Support my work
            </h2>
            <p className="text-gray-300 mb-6">Feeling generous? Support me or one of the causes I support!</p>
            <h4 className="text-lg font-semibold mb-2 text-gray-200">Charities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 md:text-sm gap-3">
              <Button
                href="https://unsilenced.org"
                icon={<FaHandcuffs />}
                target="_blank"
              >
                Unsilenced
              </Button>
              <Button
                href="https://drugpolicy.org"
                icon={<PillBottle size={16} />}
                target="_blank"
              >
                Drug Policy Alliance
              </Button>
              <Button
                href="https://www.aclu.org"
                icon={<Scale size={16} />}
                target="_blank"
              >
                ACLU
              </Button>
              <Button
                href="https://www.epicrestartfoundation.org"
                icon={<BsArrowClockwise size={16} />}
                target="_blank"
              >
                EPIC Restart Foundation
              </Button>
            </div>

            <h4 className="text-lg font-semibold mt-5 mb-2 text-gray-200">Donate to Me</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 md:text-sm gap-3">
              <Button
                href="https://donate.stripe.com/6oEeWVcXs9L9ctW4gj"
                icon={<CreditCard size={16} />}
                target="_blank"
              >
                Stripe
              </Button>
              <Button
                href="https://github.com/sponsors/ihatenodejs"
                icon={<SiGithubsponsors size={16} />}
                target="_blank"
              >
                GitHub Sponsors
              </Button>
            </div>
          </section>
        </div>
    </div>
  );
}
