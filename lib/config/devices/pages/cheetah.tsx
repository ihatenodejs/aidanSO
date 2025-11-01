/**
 * Device page configuration for Pixel 7 Pro (cheetah)
 */

import {
  Cpu,
  HardDrive,
  MemoryStick,
  Package,
  Smartphone,
  SquarePen
} from 'lucide-react'
import { MdOutlineAndroid } from 'react-icons/md'
import { RiTelegram2Fill } from 'react-icons/ri'
import { VscTerminalLinux } from 'react-icons/vsc'

import { Section, Row, Paragraphs, Paragraph } from '../components'

export const meta = {
  slug: 'cheetah',
  name: 'Pixel 7 Pro',
  shortName: 'Pixel 7 Pro',
  codename: 'cheetah',
  type: 'mobile' as const,
  manufacturer: 'Google',
  status: 'Alternative Phone',
  releaseYear: 2022,
  heroImage: {
    src: '/img/cheetah.png',
    alt: 'Google Pixel 7 Pro (cheetah)'
  },
  tagline: 'Reliable flagship with questionable battery life.',
  summary: [
    'The 7 Pro balances performance and battery, especially with crDroid.',
    'The camera stack and Tensor-only optimizations are solid.'
  ]
}

export const Content = () => (
  <>
    <Section id="hardware" title="Hardware" icon={Smartphone}>
      <Row label="Chipset" value="Google Tensor G2" icon={Cpu} />
      <Row label="RAM" value="12 GB LPDDR5" icon={MemoryStick} />
      <Row label="Storage" value="128 GB" icon={HardDrive} />
    </Section>

    <Section id="software" title="Android" icon={MdOutlineAndroid}>
      <Row
        label="Android Version"
        value="GrapheneOS Beta (Android 15)"
        filterValue="15"
        icon={MdOutlineAndroid}
        href="https://grapheneos.org/releases#cheetah"
      />
      <Row
        label="Kernel"
        value="6.1.99 android14"
        icon={VscTerminalLinux}
        href="https://github.com/GrapheneOS/Kernel"
      />
    </Section>

    <Section id="apps" title="Apps" icon={Package}>
      <Row
        label="Telegram"
        value="AyuGram"
        icon={RiTelegram2Fill}
        href="https://t.me/AyuGramReleases"
      />
    </Section>

    <Paragraphs
      id="review"
      title="Review"
      icon={SquarePen}
      rating={{ value: 4.5, scale: 5, label: 'Personal score' }}
    >
      <Paragraph>
        The jump from a Galaxy A32 5G was dramatic. Tensor silicon keeps the
        phone responsive, especially with 12 GB of RAM backing daily
        multitasking.
      </Paragraph>
      <Paragraph>
        Battery life wavers when Play Integrity tweaks are active, but the photo
        pipeline more than compensates—the Pixel still wins for quick captures.
      </Paragraph>
      <Paragraph>
        Hardware quirks aside (RIP volume rocker), Android makes on-screen
        controls painless, so the device stays an easy recommendation.
      </Paragraph>
    </Paragraphs>
  </>
)
