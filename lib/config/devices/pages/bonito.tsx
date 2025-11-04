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
import { VscTerminalLinux } from 'react-icons/vsc'
import { Section, Row } from '../components'
import { TbBrandMatrix } from 'react-icons/tb'
import { SiLineageos, SiProtonmail, SiProtoncalendar } from 'react-icons/si'

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
        value="LineageOS 22.2"
        filterValue="15"
        icon={SiLineageos}
        href="https://wiki.lineageos.org/devices/bonito/"
      />
      <Row
        label="Kernel"
        value="4.9.337"
        icon={VscTerminalLinux}
        href="https://github.com/LineageOS/android_kernel_google_msm8953"
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
        label="Email"
        value="Proton Mail"
        icon={SiProtonmail}
        href="https://f-droid.org/packages/io.element.android.x/"
      />
      <Row
        label="Calendar"
        value="Proton Calendar"
        icon={SiProtoncalendar}
        href="https://f-droid.org/packages/io.element.android.x/"
      />
    </Section>
  </>
)
