import type { Metadata } from 'next'

import ClientDevicePageShell from '@/components/device/ClientDevicePageShell'
import { deviceSlugs } from '@/lib/config/devices/client'
import { ClientDeviceService } from '@/lib/services/client-device.service'

interface DevicePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return deviceSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params
}: DevicePageProps): Promise<Metadata> {
  const { slug } = await params
  const device = ClientDeviceService.getDeviceBySlug(slug)

  if (!device) {
    return {}
  }

  const title = `${device.name} — Devices`
  const description = device.tagline ?? device.summary?.[0] ?? 'Device details'
  const canonical = `/device/${device.slug}`

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: device.heroImage.src,
      type: 'article'
    }
  }
}

export default async function DevicePage({ params }: DevicePageProps) {
  const { slug } = await params
  return <ClientDevicePageShell slug={slug} />
}
