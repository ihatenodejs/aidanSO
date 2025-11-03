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
import { MdOutlineAndroid } from 'react-icons/md'
import { RiTelegram2Fill } from 'react-icons/ri'
import { VscTerminalLinux } from 'react-icons/vsc'
import { SiProtonmail } from 'react-icons/si'

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
      <Row label="RAM" value="16 GB" icon={MemoryStick} />
      <Row label="Storage" value="128 GB" icon={HardDrive} />
    </Section>

    <Section id="software" title="Software" icon={MdOutlineAndroid}>
      <Row
        label="Android Version"
        value="Android 16 Canary"
        filterValue="16"
        icon={MdOutlineAndroid}
        href="https://developer.android.com/about/canary"
      />
      <Row label="Kernel" value="6.1.145 android14" icon={VscTerminalLinux} />
      <Row
        label="Root"
        value="KernelSU-Next"
        icon={ShieldCheck}
        href="https://github.com/rifsxd/KernelSU-Next"
      />
    </Section>

    <Section id="apps" title="Apps" icon={Package}>
      <Row label="Music" value="Tidal" icon={Music} href="https://tidal.com" />
      <Row
        label="Files"
        value="MiXplorer"
        icon={Package}
        href="https://mixplorer.com/"
      />
      <Row
        label="Matrix"
        value="Element X"
        icon={RiTelegram2Fill}
        href="https://f-droid.org/packages/io.element.android.x/"
      />
      <Row
        label="Telegram"
        value="AyuGram"
        icon={RiTelegram2Fill}
        href="https://t.me/AyuGramReleases"
      />
      <Row
        label="YouTube"
        value="ReVanced"
        icon={FaYoutube}
        href="https://revanced.app"
      />
      <Row
        label="Email"
        value="Proton Mail"
        icon={SiProtonmail}
        href="https://proton.me"
      />
    </Section>

    <Modules id="modules" title="Modules" icon={Layers}>
      <Module
        label="Busybox for Android NDK"
        href="https://github.com/Magisk-Modules-Repo/busybox-ndk"
      />
      <Module
        label="De-Bloater"
        href="https://github.com/sunilpaulmathew/De-Bloater"
      />
      <Module
        label="LSPosed - Irena"
        href="https://modules.lol/module/re-zero001-lsposed-irena"
      />
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
      <Module
        label="Zygisk Next"
        href="https://github.com/Dr-TSNG/ZygiskNext"
      />
    </Modules>
  </>
)
