import type { Metadata } from 'next'

import ClientDevicePageShell from '@/components/device/ClientDevicePageShell'
import { deviceSlugs } from '@/lib/config/devices/client'
import { ClientDeviceService } from '@/lib/services/client-device.service'

/**
 * @public
 */
export interface DevicePageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generates static paths for device pages at build time.
 *
 * @remarks
 * Pre-builds all device showcase pages to ensure optimal performance and SEO.
 * Each device slug gets its own static page based on device configurations.
 *
 * @returns Array of route parameters for static generation
 *
 * @category Static Generation
 * @public
 */
export async function generateStaticParams() {
  return deviceSlugs.map((slug) => ({ slug }))
}

/**
 * Generates metadata for device pages.
 *
 * @remarks
 * Creates dynamic page metadata including title, description,
 * and OpenGraph tags for device showcase pages based on device data.
 *
 * @param props - Metadata generation properties
 * @param props.params - Route parameters containing device slug
 * @returns Metadata object for the device page
 *
 * @category Static Generation
 * @public
 */
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
