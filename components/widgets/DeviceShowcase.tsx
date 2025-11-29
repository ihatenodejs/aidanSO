'use client'

import Image from 'next/image'
import Link from '@/components/objects/Link'
import { ClientDeviceService } from '@/lib/services/client-device.service'
import { Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Widget for displaying devices on the home page.
 * Shows a truncated list of devices with images and basic details.
 */
export default function DeviceShowcase() {
  const devices = ClientDeviceService.getAllDevicesEnriched()

  const displayDevices = devices
    .sort((a, b) => {
      if (
        a.status?.toLowerCase().includes('daily') &&
        !b.status?.toLowerCase().includes('daily')
      )
        return -1
      if (
        !a.status?.toLowerCase().includes('daily') &&
        b.status?.toLowerCase().includes('daily')
      )
        return 1

      return (b.releaseYear || 0) - (a.releaseYear || 0)
    })
    .slice(0, 3)

  return (
    <>
      <h2 className="mb-4 flex flex-row items-center gap-2 text-2xl font-semibold text-gray-200">
        <Smartphone className="h-6 w-6" />
        My Devices
      </h2>

      <div className="flex flex-1 flex-col gap-4">
        {displayDevices.map((device) => (
          <Link
            key={device.slug}
            href={`/device/${device.slug}`}
            variant="muted"
            className={cn(
              'group relative flex items-center gap-3 rounded-md border border-gray-700 bg-gray-900/30 p-3',
              'transition-all duration-200 hover:border-gray-600 hover:bg-gray-800/40 hover:no-underline'
            )}
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-800">
              <Image
                src={device.heroImage.src}
                alt={device.heroImage.alt}
                fill
                className="object-contain p-1"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <h4 className="truncate text-sm font-medium text-gray-100">
                {device.shortName || device.name}
              </h4>
              {device.status && (
                <p className="truncate text-xs text-gray-400">
                  {device.status}
                </p>
              )}
              {device.manufacturer && (
                <p className="truncate text-xs text-gray-500">
                  {device.manufacturer}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {devices.length > 3 && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              + {devices.length - 3} more device
              {devices.length - 3 !== 1 ? 's' : ''}
            </span>
            <Link href="/devices" className="font-medium text-gray-200">
              View More
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
