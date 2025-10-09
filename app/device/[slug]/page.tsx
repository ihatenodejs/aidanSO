import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DevicePageShell from '@/components/device/DevicePageShell';
import { deviceSlugs, getDeviceBySlug } from '@/lib/devices';

interface DevicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return deviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DevicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const device = getDeviceBySlug(slug);

  if (!device) {
    return {};
  }

  const title = `${device.name} — Devices`;
  const description = device.tagline ?? device.summary?.[0] ?? 'Device details';
  const canonical = `/device/${device.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: device.heroImage.src,
      type: 'article',
    },
  };
}

export default async function DevicePage({ params }: DevicePageProps) {
  const { slug } = await params;
  const device = getDeviceBySlug(slug);

  if (!device) {
    notFound();
  }

  return <DevicePageShell device={device} />;
}
