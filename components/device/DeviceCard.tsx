import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronRight,
  Calendar,
  Smartphone as SmartphoneIcon
} from 'lucide-react'
import type { ClientDeviceWithMetrics } from '@/lib/types/client-device'

interface DeviceCardProps {
  device: ClientDeviceWithMetrics
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const androidVersion = device.sections
    .find((s) => s.id === 'software')
    ?.rows?.find((r) => r.label === 'Android Version')

  return (
    <Link href={`/device/${device.slug}`}>
      <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-all hover:border-gray-700">
        {/* Device Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-800/50">
          <Image
            src={device.heroImage.src}
            alt={device.heroImage.alt}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-blue-400">
                  <SmartphoneIcon className="h-4 w-4" />
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
            <ChevronRight className="h-5 w-5 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-gray-400" />
          </div>

          {/* Device Info */}
          <div className="mb-3 flex items-center gap-4 text-xs text-gray-400">
            <span className="font-medium tracking-wide text-blue-400 uppercase">
              {device.type === 'mobile' ? 'Mobile' : 'DAP'}
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
