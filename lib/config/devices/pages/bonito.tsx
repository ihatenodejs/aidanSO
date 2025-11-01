/**
 * Device page configuration for Pixel 3a XL (bonito)
 */

import {
  Cpu,
  HardDrive,
  MemoryStick,
  Music,
  Package,
  Smartphone
} from 'lucide-react'
import { MdOutlineAndroid } from 'react-icons/md'
import { RiTelegram2Fill } from 'react-icons/ri'
import { VscTerminalLinux } from 'react-icons/vsc'
import { Section, Row, Modules, Module } from '../components'
import { TbBrandMatrix } from 'react-icons/tb'
import { SiMagisk } from 'react-icons/si'

export const meta = {
  slug: 'bonito',
  name: 'Pixel 3a XL',
  shortName: 'Pixel 3a XL',
  codename: 'bonito',
  type: 'mobile' as const,
  manufacturer: 'Google',
  status: 'Secondary phone',
  releaseYear: 2019,
  heroImage: {
    src: '/img/bonito.png',
    alt: 'Google Pixel 3a XL (bonito)'
  },
  tagline: 'Personal Favorite and Secondary Phone',
  summary: [
    `The Pixel 3a XL is what I use when I don't need my Pixel 9 Pro XL. I enjoy the simplicity yet support for modern apps.`
  ]
}

export const Content = () => (
  <>
    <Section id="hardware" title="Hardware" icon={Smartphone}>
      <Row label="Chipset" value="Qualcomm Snapdragon 670" icon={Cpu} />
      <Row label="RAM" value="4 GB" icon={MemoryStick} />
      <Row label="Storage" value="64 GB" icon={HardDrive} />
    </Section>

    <Section id="software" title="Android" icon={MdOutlineAndroid}>
      <Row
        label="Android Version"
        value="Pixel Experience 13 (Android 13)"
        filterValue="13"
        icon={MdOutlineAndroid}
        href="https://get.pixelexperience.org/bonito"
      />
      <Row
        label="Kernel"
        value="4.9.337-minimalistic"
        icon={VscTerminalLinux}
        href="https://github.com/LineageOS/android_kernel_google_msm8953"
      />
      <Row
        label="Root"
        value="Magisk"
        icon={SiMagisk}
        href="https://github.com/topjohnwu/Magisk"
      />
    </Section>

    <Section id="apps" title="Apps" icon={Package}>
      <Row label="Music" value="Tidal" icon={Music} href="https://tidal.com" />
      <Row
        label="Matrix"
        value="Element X"
        icon={TbBrandMatrix}
        href="https://f-droid.org/packages/io.element.android.x/"
      />
      <Row
        label="Telegram"
        value="Cherrygram"
        icon={RiTelegram2Fill}
        href="https://github.com/arslan4k1390/Cherrygram"
      />
    </Section>

    <Modules id="modules" title="Modules" icon={Package}>
      <Module
        label="Shamiko"
        href="https://github.com/LSPosed/LSPosed.github.io/releases"
      />
      <Module
        label="Tricky Store"
        href="https://modules.lol/module/5ec1cff-tricky-store"
      />
      <Module
        label="Yuri Keybox Manager"
        href="https://modules.lol/module/dpejoh-and-yuri-yurikey"
      />
    </Modules>
  </>
)
