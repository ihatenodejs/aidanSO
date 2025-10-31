import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devices',
  description:
    'Browse my collection of devices, from daily drivers to experimental setups. Detailed specifications, software configuration, and personal insights.'
}

export default function DeviceLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full px-6 pt-16 pb-6 md:pb-10">
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  )
}
