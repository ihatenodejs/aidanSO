/**
 * Device page configuration for FiiO JM21 (jm21)
 */

import {
  Battery,
  Bluetooth,
  Cast,
  Cpu,
  Gauge,
  HardDrive,
  Hash,
  Headphones,
  Layers,
  MemoryStick,
  Monitor,
  Music,
  Radio,
  Ruler,
  Usb,
  Wifi,
  Zap
} from 'lucide-react'
import { MdOutlineAndroid } from 'react-icons/md'
import { TbDeviceSdCard, TbFile } from 'react-icons/tb'

import { Section, Row } from '../components'

export const meta = {
  slug: 'jm21',
  name: 'FiiO JM21',
  shortName: 'FiiO JM21',
  codename: 'jm21',
  type: 'dap' as const,
  manufacturer: 'FiiO',
  status: 'Portable Hi-Fi rig',
  releaseYear: 2024,
  heroImage: {
    src: '/img/jm21.png',
    alt: 'FiiO JM21 digital audio player'
  },
  tagline: 'Compact Android DAP with dual DACs.',
  summary: [
    `The JM21 is what I use for music, when I'm looking for HiFi. The dual Cirrus Logic DACs are beyond amazing.`,
    `Android 13 keeps app support flexible, so streaming and offline libraries work perfectly.`
  ]
}

export const Content = () => (
  <>
    <Section id="core-specs" title="Hardware" icon={Cpu}>
      <Row
        label="Processor"
        value="Qualcomm Snapdragon 680 (octa-core, 2.4 GHz)"
        icon={Cpu}
      />
      <Row label="RAM" value="3GB" icon={MemoryStick} />
      <Row label="Storage" value="32GB" icon={HardDrive} />
      <Row label="Expansion" value="microSD up to 2 TB" icon={TbDeviceSdCard} />
      <Row label="Display" value='4.7" IPS, 1334 × 750' icon={Monitor} />
      <Row label="Dimensions" value="120.7 × 68 × 13 mm" icon={Ruler} />
      <Row label="Weight" value="156 g" icon={Gauge} />
      <Row label="Chassis" value="13 mm frame" icon={Layers} />
      <Row label="Battery" value="2400 mAh" icon={Battery} />
    </Section>

    <Section id="audio" title="Audio Hardware" icon={Headphones}>
      <Row label="DAC" value="Dual Cirrus Logic CS43198" icon={Headphones} />
      <Row label="Amplifier" value="Dual SGM8262" icon={Layers} />
      <Row label="Outputs" value="3.5 mm SE, 4.4 mm BAL, USB-C" icon={Radio} />
      <Row
        label="Power output"
        value="245 mW SE / 700 mW BAL @32Ω (THD+N <1%)"
        icon={Zap}
      />
      <Row label="Impedance" value="<1Ω SE, <1.5Ω BAL" icon={Hash} />
      <Row
        label="Frequency response"
        value="20 Hz – 80 kHz (<0.7 dB)"
        icon={Music}
      />
      <Row
        label="Formats"
        value="PCM 384 kHz/32-bit, DSD256, full MQA"
        icon={TbFile}
      />
    </Section>

    <Section id="connectivity" title="Connectivity & OS" icon={Wifi}>
      <Row
        label="Android Version"
        value="Custom Android 13"
        filterValue="13"
        icon={MdOutlineAndroid}
      />
      <Row label="Bluetooth" value="5.0" icon={Bluetooth} />
      <Row label="Wi-Fi" value="802.11 a/b/g/n/ac, dual-band" icon={Wifi} />
      <Row label="USB DAC" value="Asynchronous, 384 kHz/32-bit" icon={Usb} />
      <Row label="AirPlay / DLNA" value="Supported" icon={Cast} />
    </Section>
  </>
)
