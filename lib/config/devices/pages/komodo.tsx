/**
 * Device page configuration for Pixel 9 Pro XL (komodo)
 */

import {
  Cpu,
  HardDrive,
  Layers,
  MemoryStick,
  Music,
  Package,
  ShieldCheck,
  Smartphone
} from 'lucide-react'
import { FaYoutube } from 'react-icons/fa'
import { SiLineageos } from 'react-icons/si'
import { RiTelegram2Fill } from 'react-icons/ri'
import { VscTerminalLinux } from 'react-icons/vsc'

import { Section, Row, Modules, Module } from '../components'

export const meta = {
  slug: 'komodo',
  name: 'Pixel 9 Pro XL',
  shortName: 'Pixel 9 Pro XL',
  codename: 'komodo',
  type: 'mobile' as const,
  manufacturer: 'Google',
  status: 'Daily driver',
  releaseYear: 2024,
  heroImage: {
    src: '/img/komodo.png',
    alt: 'Google Pixel 9 Pro XL (komodo)'
  },
  tagline: 'My primary phone for everyday use.',
  summary: [
    `I have been daily-driving this device for several months now, and it's one of my favorites. I prefer the designs over the older, sharper Pixels.`
  ]
}

export const Content = () => (
  <>
    <Section id="hardware" title="Hardware" icon={Smartphone}>
      <Row label="Chipset" value="Google Tensor G4" icon={Cpu} />
      <Row label="RAM" value="16 GB LPDDR5X" icon={MemoryStick} />
      <Row label="Storage" value="128 GB UFS 4.0" icon={HardDrive} />
    </Section>

    <Section id="software" title="Software Stack" icon={SiLineageos}>
      <Row
        label="Android Version"
        value="LineageOS 23.2 (A16)"
        filterValue="16"
        icon={SiLineageos}
        href="https://lineageos.org/Changelog-31/"
      />
      <Row label="Kernel" value="6.1.145 android14" icon={VscTerminalLinux} />
      <Row
        label="Root"
        value="KernelSU-Next"
        icon={ShieldCheck}
        href="https://github.com/rifsxd/KernelSU-Next"
      />
    </Section>

    <Section id="apps" title="Daily Apps" icon={Package}>
      <Row label="Music" value="Tidal" icon={Music} href="https://tidal.com" />
      <Row
        label="Files"
        value="MiXplorer"
        icon={Package}
        href="https://mixplorer.com/"
      />
      <Row
        label="Telegram"
        value="AyuGram"
        icon={RiTelegram2Fill}
        href="https://t.me/AyuGramReleases"
      />
      <Row
        label="YouTube"
        value="Morphe"
        icon={FaYoutube}
        href="https://morphe.software/"
      />
    </Section>

    <Modules id="modules" title="Modules" icon={Layers}>
      <Module
        label="HMA-OSS Zygisk"
        href="https://modules.aidan.so/module/frknkrc44-hma-oss"
      />
      <Module
        label="Play Integrity Fix [INJECT]"
        href="https://modules.aidan.so/module/kowx712-play-integrity-fix-inject"
      />
      <Module
        label="Tricky Store"
        href="https://modules.aidan.so/module/5ec1cff-tricky-store"
      />
      <Module
        label="Yurikey Manager"
        href="https://modules.aidan.so/module/yurii0307-yurikey"
      />
      <Module
        label="Zygisk Next"
        href="https://modules.aidan.so/module/dr-tsng-zygisk-next"
      />
    </Modules>
  </>
)
