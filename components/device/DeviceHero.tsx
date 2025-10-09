import Image from 'next/image';

import type { DeviceHeroProps } from '@/lib/types';
import { deviceTypeLabels } from '@/lib/devices/config';

export default function DeviceHero({ device }: DeviceHeroProps) {
  const imageWidth = device.heroImage.width ?? 540;
  const imageHeight = device.heroImage.height ?? 540;

  const metadata = [
    {
      label: 'Type',
      value: deviceTypeLabels[device.type],
    },
    device.releaseYear
      ? {
          label: 'Release',
          value: device.releaseYear.toString(),
        }
      : undefined,
    device.status
      ? {
          label: 'Status',
          value: device.status,
        }
      : undefined,
    device.codename
      ? {
          label: 'Codename',
          value: device.codename,
        }
      : undefined,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 xl:gap-12">
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-100">
            {device.name}
          </h1>
          {device.tagline ? (
            <p className="text-base md:text-lg text-gray-400 max-w-2xl">{device.tagline}</p>
          ) : null}
        </div>

        {device.summary?.length ? (
          <div className="space-y-3 text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl">
            {device.summary.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {metadata.length ? (
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-gray-400">
            {metadata.map((item) => (
              <div key={item.label} className="flex flex-col">
                <dt className="uppercase text-xs tracking-wide text-gray-600">{item.label}</dt>
                <dd className="font-medium text-gray-200">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/60 p-6 md:p-8 flex items-center justify-center">
          <Image
            src={device.heroImage.src}
            alt={device.heroImage.alt}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-auto object-contain drop-shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
