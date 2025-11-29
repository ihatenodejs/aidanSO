'use client'

/**
 * Icon mapping for client-side components
 * Maps icon identifiers to actual React components
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
  Smartphone,
  Usb,
  Wifi,
  Zap,
  Package,
  ShieldCheck,
  SquarePen
} from 'lucide-react'
import { MdOutlineAndroid } from 'react-icons/md'
import { TbDeviceSdCard, TbFile } from 'react-icons/tb'
import { TbBrandMatrix } from 'react-icons/tb'
import { SiLineageos, SiProtonmail, SiProtoncalendar } from 'react-icons/si'
import { FaYoutube } from 'react-icons/fa'
import { RiTelegram2Fill } from 'react-icons/ri'
import { VscTerminalLinux } from 'react-icons/vsc'

export const iconMap = {
  // Lucide icons
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
  Smartphone,
  Usb,
  Wifi,
  Zap,
  Package,
  ShieldCheck,
  SquarePen,

  // React icons
  MdOutlineAndroid,
  TbDeviceSdCard,
  TbFile,
  TbBrandMatrix,
  SiLineageos,
  SiProtonmail,
  SiProtoncalendar,
  FaYoutube,
  RiTelegram2Fill,
  VscTerminalLinux
} as const

/**
 * Reverse map: component reference -> identifier string
 * This is used to convert icon components back to their string identifiers
 */
const reverseIconMap = new Map<
  React.ComponentType<{ className?: string; size?: number }>,
  string
>()

Object.entries(iconMap).forEach(([key, component]) => {
  reverseIconMap.set(component, key)
})

/**
 * Get icon component by identifier
 */
export function getIcon(
  iconId?: string
): React.ComponentType<{ className?: string; size?: number }> | null {
  if (!iconId) return null
  return (
    iconMap as Record<
      string,
      React.ComponentType<{ className?: string; size?: number }>
    >
  )[iconId]
}

/**
 * Get icon identifier from component reference
 * Used to convert icon components to string identifiers
 */
export function getIconId(
  icon?: React.ComponentType<{ className?: string; size?: number }> | string
): string {
  if (!icon) return ''
  if (typeof icon === 'string') return icon
  return reverseIconMap.get(icon) || ''
}
