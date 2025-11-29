#!/usr/bin/env bun
/**
 * Build-time script to pre-transform device data from TSX components
 * This ensures device data is available in production builds
 */

import { join } from 'node:path'
import { transformDevicePage } from '../lib/config/devices/transformer'
import type { DeviceCollection } from '../lib/types'
import { logger } from '../lib/utils/logger'

/**
 * Get icon identifier from component reference
 * Build-time version that uses component name properties
 */
function getIconId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any,
  context?: string
): string {
  if (!icon) return ''
  if (typeof icon === 'string') return icon

  const componentName = icon.displayName || icon.name || icon.render?.name || ''

  if (!componentName && context) {
    logger.warning(
      `⚠️  Warning: Unable to extract icon identifier for ${context}. Icon may not render correctly.`,
      'build-device-data'
    )
  }

  return componentName
}

import * as komodo from '../lib/config/devices/pages/komodo'
import * as cheetah from '../lib/config/devices/pages/cheetah'
import * as bonito from '../lib/config/devices/pages/bonito'
import * as jm21 from '../lib/config/devices/pages/jm21'

const deviceModules = {
  komodo,
  cheetah,
  bonito,
  jm21
}

async function buildDeviceData() {
  logger.info('Building device data...', 'build-device-data')

  const devices: DeviceCollection = {}
  const clientDevices: Record<string, unknown> = {}

  for (const [slug, module] of Object.entries(deviceModules)) {
    try {
      logger.debug(`Transforming ${slug}...`, 'build-device-data')
      const fullDevice = transformDevicePage(module)
      devices[slug] = fullDevice

      const { sections, ...clientDevice } = fullDevice
      const clientSections = sections.map((section) => {
        const iconName = getIconId(section.icon, `${slug}.${section.id}.icon`)
        return {
          ...section,
          icon: iconName,
          rows: section.rows?.map((row) => {
            const rowIconName = getIconId(
              row.icon,
              `${slug}.${section.id}.${row.label}.icon`
            )
            return {
              ...row,
              icon: rowIconName
            }
          })
        }
      })

      clientDevices[slug] = {
        ...clientDevice,
        sections: clientSections
      }
    } catch (error) {
      logger.error(`✗ Failed to transform ${slug}`, 'build-device-data', error)
      process.exit(1)
    }
  }

  const outputPath = join(__dirname, '../lib/config/devices/built-devices.json')
  await Bun.write(outputPath, JSON.stringify(devices, null, 2))

  const clientOutputPath = join(
    __dirname,
    '../lib/config/devices/built-devices-client.json'
  )
  await Bun.write(clientOutputPath, JSON.stringify(clientDevices, null, 2))

  logger.success(
    `Device data built successfully (${Object.keys(devices).length} devices)`,
    'build-device-data'
  )
  logger.debug(`Server output: ${outputPath}`, 'build-device-data')
  logger.debug(`Client output: ${clientOutputPath}`, 'build-device-data')
}

buildDeviceData().catch((error) => {
  logger.error('Build failed', 'build-device-data', error)
  process.exit(1)
})
