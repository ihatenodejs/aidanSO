import {
  Battery,
  Bluetooth,
  Clock,
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
  Package,
  Radio,
  Ruler,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SquarePen,
  Usb,
  Wifi,
  Zap
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { MdOutlineAndroid } from 'react-icons/md';
import { RiTelegram2Fill } from 'react-icons/ri';
import { TbDeviceSdCard } from 'react-icons/tb';
import { VscTerminalLinux } from 'react-icons/vsc';

import type { DeviceCollection } from '@/lib/types';

export const devices: DeviceCollection = {
  komodo: {
    slug: 'komodo',
    name: 'Pixel 9 Pro XL',
    shortName: 'Pixel 9 Pro XL',
    codename: 'komodo',
    type: 'mobile',
    manufacturer: 'Google',
    status: 'Android beta lab',
    releaseYear: 2024,
    heroImage: {
      src: '/img/komodo.png',
      alt: 'Google Pixel 9 Pro XL (komodo)',
    },
    tagline: 'Bleeding-edge Pixel tuned for experimentation and kernel tinkering.',
    summary: [
      'The Pixel 9 Pro XL is my sandbox for canary Android builds. It runs preview releases while staying rooted thanks to KernelSU-Next and a SUSFS-enabled kernel.',
      'I lean on it for testing new modules and automation ideas before they touch my day-to-day setup.',
    ],
    stats: [
      {
        title: 'Core silicon',
        icon: Cpu,
        items: [
          { label: 'SoC', value: 'Google Tensor G4' },
          { label: 'RAM', value: '16 GB LPDDR5X' },
          { label: 'Storage', value: '128 GB UFS 4.0' },
        ],
      },
      {
        title: 'Software channel',
        icon: MdOutlineAndroid,
        items: [
          {
            label: 'ROM',
            value: 'Android 16 QPR2',
            href: 'https://developer.android.com/about/versions/16/qpr2',
          },
          {
            label: 'Kernel',
            value: '6.1.138 android14 (SUSFS Wild)',
            href: 'https://github.com/WildKernels/GKI_KernelSU_SUSFS',
          },
          {
            label: 'Root',
            value: 'KernelSU-Next',
            href: 'https://github.com/rifsxd/KernelSU-Next',
          },
        ],
      },
      {
        title: 'Media stack',
        icon: Music,
        items: [
          { label: 'Streaming', value: 'Tidal', href: 'https://tidal.com' },
          { label: 'Local files', value: 'MiXplorer', href: 'https://mixplorer.com/' },
          { label: 'Video', value: 'ReVanced', href: 'https://revanced.app' },
        ],
      },
    ],
    sections: [
      {
        id: 'hardware',
        title: 'Hardware Snapshot',
        icon: Smartphone,
        rows: [
          { label: 'Chipset', value: 'Google Tensor G4', icon: Cpu },
          { label: 'RAM', value: '16 GB LPDDR5X', icon: MemoryStick },
          { label: 'Storage', value: '128 GB UFS 4.0', icon: HardDrive },
        ],
      },
      {
        id: 'software',
        title: 'Software Stack',
        icon: MdOutlineAndroid,
        rows: [
          {
            label: 'ROM',
            value: 'Android 16 QPR2',
            icon: MdOutlineAndroid,
            href: 'https://developer.android.com/about/versions/16/qpr2',
          },
          {
            label: 'Kernel',
            value: '6.1.138 android14 (SUSFS Wild)',
            icon: VscTerminalLinux,
            href: 'https://github.com/WildKernels/GKI_KernelSU_SUSFS',
          },
          {
            label: 'Root',
            value: 'KernelSU-Next',
            icon: ShieldCheck,
            href: 'https://github.com/rifsxd/KernelSU-Next',
          },
        ],
      },
      {
        id: 'apps',
        title: 'Daily Apps',
        icon: Package,
        rows: [
          { label: 'Music', value: 'Tidal', icon: Music, href: 'https://tidal.com' },
          { label: 'Files', value: 'MiXplorer', icon: Package, href: 'https://mixplorer.com/' },
          { label: 'Telegram', value: 'AyuGram', icon: RiTelegram2Fill, href: 'https://t.me/AyuGramReleases' },
          { label: 'YouTube', value: 'ReVanced', icon: FaYoutube, href: 'https://revanced.app' },
        ],
      },
      {
        id: 'modules',
        title: 'Module Suite',
        icon: Layers,
        listItems: [
          { label: 'bindhosts', href: 'https://modules.lol/module/kowx712-bindhosts' },
          { label: 'Emoji Replacer', href: 'https://github.com/EmojiReplacer/Emoji-Replacer' },
          { label: 'F-Droid Privileged Extension', href: 'https://modules.lol/module/entr0pia-f-droid-privileged-extension-installer' },
          { label: 'SUSFS for KernelSU', href: 'https://modules.lol/module/sidex15-susfs' },
          { label: 'Tricky Store', href: 'https://modules.lol/module/5ec1cff-tricky-store' },
          { label: 'Yuri Keybox Manager', href: 'https://modules.lol/module/dpejoh-and-yuri-yurikey' },
        ],
      }
    ],
  },
  cheetah: {
    slug: 'cheetah',
    name: 'Pixel 7 Pro',
    shortName: 'Pixel 7 Pro',
    codename: 'cheetah',
    type: 'mobile',
    manufacturer: 'Google',
    status: 'Daily driver',
    releaseYear: 2022,
    heroImage: {
      src: '/img/cheetah.png',
      alt: 'Google Pixel 7 Pro (cheetah)',
    },
    tagline: 'Reliable flagship tuned for rooted daily use.',
    summary: [
      'My everyday carry balances performance and battery life with a stable crDroid build and KernelSU-Next for system-level tweaks.',
      'The camera stack and Tensor-only optimizations still impress, especially when paired with my media workflow.',
    ],
    stats: [
      {
        title: 'Core hardware',
        icon: Cpu,
        items: [
          { label: 'SoC', value: 'Google Tensor G2' },
          { label: 'RAM', value: '12 GB LPDDR5' },
          { label: 'Storage', value: '128 GB' },
        ],
      },
      {
        title: 'Current build',
        icon: MdOutlineAndroid,
        items: [
          { label: 'ROM', value: 'crDroid 11.6', href: 'https://crdroid.net' },
          { label: 'Kernel', value: '6.1.99 android14' },
          { label: 'Root', value: 'KernelSU-Next', href: 'https://github.com/rifsxd/KernelSU-Next' },
        ],
      },
      {
        title: 'Media kit',
        icon: Music,
        items: [
          { label: 'Streaming', value: 'Tidal', href: 'https://tidal.com' },
          { label: 'Files', value: 'MiXplorer', href: 'https://mixplorer.com/' },
          { label: 'YouTube', value: 'ReVanced', href: 'https://revanced.app' },
        ],
      },
    ],
    sections: [
      {
        id: 'hardware',
        title: 'Hardware Snapshot',
        icon: Smartphone,
        rows: [
          { label: 'Chipset', value: 'Google Tensor G2', icon: Cpu },
          { label: 'RAM', value: '12 GB LPDDR5', icon: MemoryStick },
          { label: 'Storage', value: '128 GB', icon: HardDrive },
        ],
      },
      {
        id: 'software',
        title: 'Software Stack',
        icon: MdOutlineAndroid,
        rows: [
          {
            label: 'ROM',
            value: 'crDroid Android 11.6',
            icon: MdOutlineAndroid,
            href: 'https://crdroid.net',
          },
          {
            label: 'Kernel',
            value: '6.1.99 android14',
            icon: VscTerminalLinux,
          },
          {
            label: 'Root',
            value: 'KernelSU-Next',
            icon: ShieldCheck,
            href: 'https://github.com/rifsxd/KernelSU-Next',
          },
        ],
      },
      {
        id: 'apps',
        title: 'App Loadout',
        icon: Package,
        rows: [
          { label: 'Music', value: 'Tidal', icon: Music, href: 'https://tidal.com' },
          { label: 'Files', value: 'MiXplorer', icon: Package, href: 'https://mixplorer.com/' },
          { label: 'Telegram', value: 'AyuGram', icon: RiTelegram2Fill, href: 'https://t.me/AyuGramReleases' },
          { label: 'YouTube', value: 'ReVanced', icon: FaYoutube, href: 'https://revanced.app' },
        ],
      },
      {
        id: 'modules',
        title: 'Module Suite',
        icon: Layers,
        listItems: [
          { label: 'bindhosts', href: 'https://github.com/bindhosts/bindhosts' },
          { label: 'Emoji Replacer', href: 'https://github.com/EmojiReplacer/Emoji-Replacer' },
          { label: 'ReZygisk', href: 'https://github.com/PerformanC/ReZygisk' },
          { label: 'LSPosed JingMatrix', href: 'https://github.com/JingMatrix/LSPosed' },
        ],
      },
      {
        id: 'review',
        title: 'Review',
        icon: SquarePen,
        rating: {
          value: 4.5,
          scale: 5,
          label: 'Personal score',
        },
        paragraphs: [
          'The jump from a Galaxy A32 5G was dramatic. Tensor silicon keeps the phone responsive, especially with 12 GB of RAM backing daily multitasking.',
          'Battery life wavers when Play Integrity tweaks are active, but the photo pipeline more than compensates—the Pixel still wins for quick captures.',
          'Hardware quirks aside (RIP volume rocker), Android makes on-screen controls painless, so the device stays an easy recommendation.',
        ],
      },
    ],
  },
  bonito: {
    slug: 'bonito',
    name: 'Pixel 3a XL',
    shortName: 'Pixel 3a XL',
    codename: 'bonito',
    type: 'mobile',
    manufacturer: 'Google',
    status: 'Ubuntu Touch testing',
    releaseYear: 2019,
    heroImage: {
      src: '/img/bonito.png',
      alt: 'Google Pixel 3a XL (bonito)',
    },
    tagline: 'Legacy Pixel reborn as a sandbox for Ubuntu Touch.',
    summary: [
      'Retired from Android duty, the Pixel 3a XL now explores the Ubuntu Touch ecosystem as a daily development mule.',
      'It highlights what the community-driven OS can do on aging hardware while still handling lightweight messaging and media.',
    ],
    stats: [
      {
        title: 'Core silicon',
        icon: Cpu,
        items: [
          { label: 'Chipset', value: 'Snapdragon 670' },
          { label: 'RAM', value: '4 GB' },
          { label: 'Storage', value: '64 GB' },
        ],
      },
      {
        title: 'Current build',
        icon: MdOutlineAndroid,
        items: [
          {
            label: 'OS',
            value: 'Ubuntu Touch stable',
            href: 'https://www.ubuntu-touch.io',
          },
          { label: 'Kernel', value: '4.9.337' },
        ],
      },
      {
        title: 'Essentials',
        icon: Package,
        items: [
          { label: 'Music', value: 'uSonic', href: 'https://github.com/arubislander/uSonic' },
          { label: 'Messaging', value: 'TELEports', href: 'https://open-store.io/app/teleports.ubports' },
        ],
      },
    ],
    sections: [
      {
        id: 'hardware',
        title: 'Hardware Snapshot',
        icon: Smartphone,
        rows: [
          { label: 'Chipset', value: 'Qualcomm Snapdragon 670', icon: Cpu },
          { label: 'RAM', value: '4 GB', icon: MemoryStick },
          { label: 'Storage', value: '64 GB', icon: HardDrive },
        ],
      },
      {
        id: 'software',
        title: 'Software Stack',
        icon: MdOutlineAndroid,
        rows: [
          {
            label: 'OS',
            value: 'Ubuntu Touch',
            icon: MdOutlineAndroid,
            href: 'https://www.ubuntu-touch.io',
          },
          { label: 'Kernel', value: '4.9.337', icon: VscTerminalLinux },
        ],
      },
      {
        id: 'apps',
        title: 'App Loadout',
        icon: Package,
        rows: [
          { label: 'Music', value: 'uSonic', icon: Music, href: 'https://github.com/arubislander/uSonic' },
          { label: 'Messaging', value: 'TELEports', icon: RiTelegram2Fill, href: 'https://open-store.io/app/teleports.ubports' },
        ],
      }
    ],
  },
  jm21: {
    slug: 'jm21',
    name: 'FiiO JM21',
    shortName: 'FiiO JM21',
    codename: 'jm21',
    type: 'dap',
    manufacturer: 'FiiO',
    status: 'Portable Hi-Fi rig',
    releaseYear: 2024,
    heroImage: {
      src: '/img/jm21.png',
      alt: 'FiiO JM21 digital audio player',
    },
    tagline: 'Compact Android DAP with a dual-DAC audio chain.',
    summary: [
      'The JM21 is my dedicated portable rig. Dual Cirrus Logic DACs and a balanced amp stage deliver more headroom than a typical phone stack.',
      'Android 13 keeps app support flexible, so streaming and offline libraries live together without compromise.',
    ],
    stats: [
      {
        title: 'Audio pipeline',
        icon: Headphones,
        items: [
          { label: 'DAC', value: 'Dual CS43198' },
          { label: 'Amp', value: 'Dual SGM8262' },
          { label: 'SNR', value: 'Up to 129 dB' },
        ],
      },
      {
        title: 'Outputs',
        icon: Radio,
        items: [
          { label: 'Single-ended', value: '3.5 mm' },
          { label: 'Balanced', value: '4.4 mm' },
          { label: 'Digital', value: 'USB-C / coaxial' },
        ],
      },
      {
        title: 'Power & runtime',
        icon: Battery,
        items: [
          { label: 'Power', value: '245 mW SE / 700 mW BAL @32Ω' },
          { label: 'Battery', value: '2400 mAh' },
          { label: 'Storage', value: '32 GB + microSD up to 2 TB' },
        ],
      },
    ],
    sections: [
      {
        id: 'core-specs',
        title: 'Core Specs',
        icon: Cpu,
        rows: [
          { label: 'Processor', value: 'Qualcomm Snapdragon 680 (octa-core, 2.4 GHz)', icon: Cpu },
          { label: 'RAM', value: '3 GB', icon: MemoryStick },
          { label: 'Storage', value: '32 GB (≈22 GB usable)', icon: HardDrive },
          { label: 'Expansion', value: 'microSD up to 2 TB', icon: TbDeviceSdCard },
          { label: 'Display', value: '4.7" IPS, 1334 × 750', icon: Monitor },
          { label: 'Dimensions', value: '120.7 × 68 × 13 mm', icon: Ruler },
          { label: 'Weight', value: '156 g', icon: Gauge },
          { label: 'Chassis', value: 'Ultra-thin 13 mm frame', icon: Layers },
        ],
      },
      {
        id: 'audio',
        title: 'Audio Hardware',
        icon: Headphones,
        rows: [
          { label: 'DAC', value: 'Dual Cirrus Logic CS43198', icon: Headphones },
          { label: 'Amplifier', value: 'Dual SGM8262', icon: Layers },
          { label: 'Outputs', value: '3.5 mm SE, 4.4 mm BAL, coaxial, USB-C', icon: Radio },
          { label: 'Power output', value: '245 mW SE / 700 mW BAL @32Ω (THD+N <1%)', icon: Zap },
          { label: 'Impedance', value: '<1Ω SE, <1.5Ω BAL', icon: Hash },
          { label: 'Frequency response', value: '20 Hz – 80 kHz (<0.7 dB)', icon: Music },
          { label: 'Formats', value: 'PCM 384 kHz/32-bit, DSD256, full MQA', icon: Sparkles },
        ],
      },
      {
        id: 'connectivity',
        title: 'Connectivity & OS',
        icon: Wifi,
        rows: [
          { label: 'OS', value: 'Custom Android 13', icon: MdOutlineAndroid },
          { label: 'Bluetooth', value: 'v5.0 (SBC, AAC, aptX, aptX HD, LDAC, LHDC)', icon: Bluetooth },
          { label: 'Wi-Fi', value: '802.11 a/b/g/n/ac, dual-band', icon: Wifi },
          { label: 'USB DAC', value: 'Asynchronous, 384 kHz/32-bit', icon: Usb },
          { label: 'AirPlay / DLNA', value: 'Supported', icon: Cast },
          { label: 'Battery', value: '2400 mAh', icon: Battery },
          { label: 'Charging', value: '≈2 h via 5V 2A', icon: Clock },
        ],
      },
    ],
  },
};

export const deviceSlugs = Object.keys(devices);

export const mobileDevices = Object.values(devices).filter((device) => device.type === 'mobile');

export const dapDevices = Object.values(devices).filter((device) => device.type === 'dap');

export function getDeviceBySlug(slug: string) {
  return devices[slug];
}
