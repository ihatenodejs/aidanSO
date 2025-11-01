import Image from 'next/image'

import type { DeviceHeroProps } from '@/lib/types'
import { deviceTypeLabels } from '@/lib/config/devices/config'

export default function DeviceHero({ device }: DeviceHeroProps) {
  const imageWidth = device.heroImage.width ?? 540
  const imageHeight = device.heroImage.height ?? 540

  const metadata = [
    {
      label: 'Type',
      value: deviceTypeLabels[device.type]
    },
    device.releaseYear
      ? {
          label: 'Release',
          value: device.releaseYear.toString()
        }
      : undefined,
    device.status
      ? {
          label: 'Status',
          value: device.status
        }
      : undefined,
    device.codename
      ? {
          label: 'Codename',
          value: device.codename
        }
      : undefined
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-12">
      <div className="space-y-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm md:p-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-gray-100 md:text-4xl">
            {device.name}
          </h1>
          {device.tagline ? (
            <p className="max-w-2xl text-base text-gray-400 md:text-lg">
              {device.tagline}
            </p>
          ) : null}
        </div>

        {device.summary?.length ? (
          <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-gray-400 md:text-base">
            {device.summary.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {metadata.length ? (
          <dl className="grid gap-3 text-sm text-gray-400 sm:grid-cols-2 lg:grid-cols-3">
            {metadata.map((item) => (
              <div key={item.label} className="flex flex-col">
                <dt className="text-xs tracking-wide text-gray-600 uppercase">
                  {item.label}
                </dt>
                <dd className="font-medium text-gray-200">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="flex items-center justify-center">
        <div className="flex w-full max-w-md items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/60 p-6 md:p-8">
          <Image
            src={device.heroImage.src}
            alt={device.heroImage.alt}
            width={imageWidth}
            height={imageHeight}
            className="h-auto w-full object-contain drop-shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  )
}
