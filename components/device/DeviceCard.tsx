import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronRight,
  Calendar,
  Smartphone as SmartphoneIcon,
  Music
} from 'lucide-react'
import type { ClientDeviceWithMetrics } from '@/lib/types/client-device'

/**
 * @public
 */
export interface DeviceCardProps {
  device: ClientDeviceWithMetrics
  variant?: 'default' | 'featured'
  showStatus?: boolean
  className?: string
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const androidVersion = device.sections
    .find((s) => s.id === 'software')
    ?.rows?.find((r) => r.label === 'Android Version')

  const isMobile = device.type === 'mobile'
  const deviceColor = isMobile ? 'text-blue-400' : 'text-purple-400'

  return (
    <Link href={`/device/${device.slug}`}>
      <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-gray-700 p-4 transition-colors duration-300 hover:border-gray-600">
        {/* Device Image */}
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md bg-gray-800/50">
          <Image
            src={device.heroImage.src}
            alt={device.heroImage.alt}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className={deviceColor}>
                  {isMobile ? (
                    <SmartphoneIcon className="h-4 w-4" />
                  ) : (
                    <Music className="h-4 w-4" />
                  )}
                </span>
                <h3 className="text-lg font-semibold text-gray-100 transition-colors group-hover:text-white">
                  {device.shortName || device.name}
                </h3>
              </div>
              {device.codename && (
                <p className="mb-1 font-mono text-sm text-gray-500">
                  {device.codename}
                </p>
              )}
              <p className="line-clamp-2 min-h-10 text-sm text-gray-500">
                {device.tagline}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-400" />
          </div>

          {/* Device Info */}
          <div className="mb-3 flex items-center gap-4 text-xs text-gray-400">
            <span
              className={`font-medium tracking-wide uppercase ${deviceColor}`}
            >
              {isMobile ? 'Mobile' : 'DAP'}
            </span>
            {device.manufacturer && (
              <>
                <span className="text-gray-600">•</span>
                <span>{device.manufacturer}</span>
              </>
            )}
            {device.status && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-slate-500/80">{device.status}</span>
              </>
            )}
          </div>

          {/* Bottom Metadata */}
          <div className="mt-auto flex flex-col gap-2 border-t border-gray-800/50 pt-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                {device.releaseYear && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-gray-400">{device.releaseYear}</span>
                  </div>
                )}
                {androidVersion && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Android</span>
                    <span className="font-medium text-gray-300">
                      {androidVersion.filterValue || androidVersion.value}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
