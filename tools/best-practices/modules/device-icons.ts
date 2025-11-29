import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { CheckDefinition } from '../types'

interface IconCheckResult {
  file: string
  totalIcons: number
  matchedIcons: number
  unmatchedIcons: string[]
}

export const checks: CheckDefinition[] = [
  {
    id: 'device-icons',
    description: 'Verify device file icons match icon map',
    run: async ({ repoRoot }) => {
      const devicesDir = resolve(repoRoot, 'lib/config/devices/pages')
      const iconMapPath = resolve(repoRoot, 'lib/config/devices/icon-map.ts')

      const iconMapContent = await Bun.file(iconMapPath).text()
      const iconMapMatches = iconMapContent.match(
        /export const iconMap = \{([\s\S]+)\}/
      )
      const availableIcons = new Set<string>()

      if (iconMapMatches) {
        const iconMapObject = iconMapMatches[1]
        const iconNames = iconMapObject.match(
          /^[ \t]*([A-Za-z][A-Za-z0-9]*)[ \t]*[,\s]*$/gm
        )
        if (iconNames) {
          iconNames.forEach((name) => {
            const cleanName = name.replace(/^[ \t]*|[ \t]*[,\s]*$/g, '').trim()
            availableIcons.add(cleanName)
          })
        }
      }

      const entries = await readdir(devicesDir, { withFileTypes: true })
      const deviceFiles = entries
        .filter(
          (entry) =>
            entry.isFile() &&
            entry.name.endsWith('.tsx') &&
            entry.name !== 'index.ts'
        )
        .map((entry) => entry.name)

      const results: IconCheckResult[] = []

      for (const file of deviceFiles) {
        const filePath = resolve(devicesDir, file)
        const content = await Bun.file(filePath).text()

        const importMatches = content.match(
          /import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"]/g
        )
        const iconUsageMatches = content.match(/icon=\{[^}]+\}/g)

        const allIcons = new Set<string>()

        if (importMatches) {
          importMatches.forEach((match) => {
            const icons = match.replace(
              /import\s+\{|}\s+from\s+['"][^'"]+['"]/g,
              ''
            )
            icons.split(',').forEach((icon) => {
              const cleanIcon = icon.trim()
              if (cleanIcon && !cleanIcon.startsWith('...')) {
                allIcons.add(cleanIcon)
              }
            })
          })
        }

        if (iconUsageMatches) {
          iconUsageMatches.forEach((match) => {
            const icons = match.replace(/icon=\{|\}/g, '')
            icons.split(',').forEach((icon) => {
              const cleanIcon = icon.trim()
              if (cleanIcon) {
                allIcons.add(cleanIcon)
              }
            })
          })
        }

        const componentNames = new Set([
          'Section',
          'Row',
          'Modules',
          'Module',
          'Paragraphs',
          'Paragraph'
        ])
        const filteredIcons = Array.from(allIcons).filter(
          (icon) => !componentNames.has(icon)
        )

        const totalIcons = filteredIcons.length
        const matchedIcons = filteredIcons.filter((icon) =>
          availableIcons.has(icon)
        ).length
        const unmatchedIcons = filteredIcons.filter(
          (icon) => !availableIcons.has(icon)
        )

        results.push({
          file,
          totalIcons,
          matchedIcons,
          unmatchedIcons
        })
      }

      const totalIcons = results.reduce((sum, r) => sum + r.totalIcons, 0)
      const totalMatched = results.reduce((sum, r) => sum + r.matchedIcons, 0)
      const totalUnmatched = results.reduce(
        (sum, r) => sum + r.unmatchedIcons.length,
        0
      )

      const messages: string[] = []

      if (totalIcons === 0) {
        messages.push('No icons found in device files')
      } else {
        messages.push(
          `Found ${totalIcons} total icons across ${results.length} device files`
        )
        messages.push(
          `${totalMatched} icons (${((totalMatched / totalIcons) * 100).toFixed(1)}%) match icon map`
        )

        if (totalUnmatched > 0) {
          messages.push(`${totalUnmatched} icons do not match icon map:`)
          results.forEach((result) => {
            if (result.unmatchedIcons.length > 0) {
              messages.push(
                `  ${result.file}: ${result.unmatchedIcons.join(', ')}`
              )
            }
          })
        }
      }

      return {
        id: 'device-icons',
        ok: totalUnmatched === 0,
        messages
      }
    }
  }
]
