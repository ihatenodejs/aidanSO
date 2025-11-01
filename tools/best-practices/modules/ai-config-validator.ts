import type { CheckContext, CheckDefinition, CheckResult } from '../types'

const aiConfigValidator: CheckDefinition = {
  id: 'ai-config-validator',
  description: 'Validates AI configuration data.',
  async run(context: CheckContext): Promise<CheckResult> {
    const messages: string[] = []
    let hasErrors = false

    // Test 1: Load raw source file to validate before schema processing
    try {
      const fs = await import('node:fs/promises')
      const { resolve } = await import('node:path')

      const filePath = resolve(context.repoRoot, 'lib/config/ai-usage.tsx')
      const fileContent = await fs.readFile(filePath, 'utf-8')

      const activeStatusPattern =
        /status:\s*['"](?:primary|active|occasional)['"]/g

      const activeMatches: Array<{ index: number; status: string }> = []
      let match
      while ((match = activeStatusPattern.exec(fileContent)) !== null) {
        const status = match[0].match(/['"]([^'"]+)['"]/)?.[1] || ''
        activeMatches.push({ index: match.index, status })
      }

      for (const activeMatch of activeMatches) {
        const beforeStatus = fileContent.slice(0, activeMatch.index)
        const afterStatus = fileContent.slice(activeMatch.index)

        const openBraceIndex = beforeStatus.lastIndexOf('{')
        let braceCount = 1
        let closeBraceIndex = -1
        for (let i = 0; i < afterStatus.length; i++) {
          if (afterStatus[i] === '{') braceCount++
          if (afterStatus[i] === '}') {
            braceCount--
            if (braceCount === 0) {
              closeBraceIndex = activeMatch.index + i
              break
            }
          }
        }

        if (openBraceIndex !== -1 && closeBraceIndex !== -1) {
          const objectContent = fileContent.slice(
            openBraceIndex,
            closeBraceIndex + 1
          )

          if (/reason:\s*['"]/.test(objectContent)) {
            const nameMatch = objectContent.match(/name:\s*['"]([^'"]+)['"]/)
            const toolName = nameMatch?.[1] || '(unknown)'

            hasErrors = true
            messages.push(
              `Active tool "${toolName}" (status: ${activeMatch.status}) has a 'reason' field in source. Only inactive tools (cancelled/unused) should have reasons.`
            )
          }
        }
      }

      const configPath = '../../../lib/config/ai-usage'
      const configModule = await import(configPath).catch((error) => {
        throw new Error(`Failed to import ai-usage config: ${error.message}`)
      })

      const { aiTools, favoriteModels, aiReviews, inactiveAiTools } =
        configModule

      // Test 2: Ensure aiTools array is not empty
      if (!Array.isArray(aiTools) || aiTools.length === 0) {
        hasErrors = true
        messages.push('aiTools array is empty or not an array')
      }

      // Test 3: Validate active tools don't have 'reason' field
      if (Array.isArray(aiTools)) {
        for (const tool of aiTools) {
          const isActive = ['primary', 'active', 'occasional'].includes(
            tool.status
          )
          const isInactive = ['cancelled', 'unused'].includes(tool.status)

          const toolAsAny = tool as Record<string, unknown>

          if (
            isActive &&
            'reason' in toolAsAny &&
            toolAsAny.reason !== undefined
          ) {
            hasErrors = true
            messages.push(
              `Active tool "${tool.name}" (status: ${tool.status}) has a 'reason' field. Only inactive tools (cancelled/unused) should have reasons.`
            )
          }

          if (isInactive) {
            const reason = toolAsAny.reason
            if (
              !reason ||
              (typeof reason === 'string' && reason.trim() === '')
            ) {
              hasErrors = true
              messages.push(
                `Inactive tool "${tool.name}" (status: ${tool.status}) is missing a required 'reason' field.`
              )
            }
          }
        }
      }

      // Test 4: Validate icon/svg exclusivity
      if (Array.isArray(aiTools)) {
        for (const tool of aiTools) {
          const hasIcon = 'icon' in tool && tool.icon !== undefined
          const hasSvg = 'svg' in tool && tool.svg !== undefined

          if (hasIcon && hasSvg) {
            hasErrors = true
            messages.push(
              `Tool "${tool.name}" has both 'icon' and 'svg' properties. Only one should be defined.`
            )
          }

          if (!hasIcon && !hasSvg) {
            hasErrors = true
            messages.push(
              `Tool "${tool.name}" is missing both 'icon' and 'svg' properties. One must be defined.`
            )
          }
        }
      }

      // Test 5: Validate price constraints
      if (Array.isArray(aiTools)) {
        for (const tool of aiTools) {
          if ('price' in tool && typeof tool.price === 'number') {
            if (tool.price < 0) {
              hasErrors = true
              messages.push(
                `Tool "${tool.name}" has a negative price: ${tool.price}`
              )
            }
          }

          if (
            'discountedPrice' in tool &&
            typeof tool.discountedPrice === 'number'
          ) {
            if (!('price' in tool) || tool.price === undefined) {
              hasErrors = true
              messages.push(
                `Tool "${tool.name}" has discountedPrice but no price defined`
              )
            } else if (
              typeof tool.price === 'number' &&
              tool.discountedPrice > tool.price
            ) {
              hasErrors = true
              messages.push(
                `Tool "${tool.name}" has discountedPrice (${tool.discountedPrice}) greater than price (${tool.price})`
              )
            }

            if (tool.discountedPrice < 0) {
              hasErrors = true
              messages.push(
                `Tool "${tool.name}" has a negative discountedPrice: ${tool.discountedPrice}`
              )
            }
          }
        }
      }

      // Test 6: Validate favoriteModels structure
      if (Array.isArray(favoriteModels)) {
        for (const model of favoriteModels) {
          if (!model.name || model.name.trim() === '') {
            hasErrors = true
            messages.push('A favorite model is missing a name')
          }

          if (!model.provider || model.provider.trim() === '') {
            hasErrors = true
            messages.push(
              `Favorite model "${model.name || '(unnamed)'}" is missing a provider`
            )
          }

          if (!model.review || model.review.trim() === '') {
            hasErrors = true
            messages.push(
              `Favorite model "${model.name || '(unnamed)'}" is missing a review`
            )
          }

          if (
            typeof model.rating !== 'number' ||
            model.rating < 0 ||
            model.rating > 10
          ) {
            hasErrors = true
            messages.push(
              `Favorite model "${model.name || '(unnamed)'}" has an invalid rating. Must be a number between 0 and 10, got: ${model.rating}`
            )
          }
        }
      } else {
        hasErrors = true
        messages.push('favoriteModels is not an array')
      }

      // Test 7: Validate aiReviews structure
      if (Array.isArray(aiReviews)) {
        for (const review of aiReviews) {
          if (!review.tool || review.tool.trim() === '') {
            hasErrors = true
            messages.push('An AI review is missing a tool name')
          }

          if (
            typeof review.rating !== 'number' ||
            review.rating < 0 ||
            review.rating > 10
          ) {
            hasErrors = true
            messages.push(
              `AI review for "${review.tool || '(unnamed)'}" has an invalid rating. Must be a number between 0 and 10, got: ${review.rating}`
            )
          }

          if (!Array.isArray(review.pros)) {
            hasErrors = true
            messages.push(
              `AI review for "${review.tool || '(unnamed)'}" has invalid pros (must be an array)`
            )
          } else if (review.pros.length === 0) {
            hasErrors = true
            messages.push(
              `AI review for "${review.tool || '(unnamed)'}" has no pros listed`
            )
          }

          if (!Array.isArray(review.cons)) {
            hasErrors = true
            messages.push(
              `AI review for "${review.tool || '(unnamed)'}" has invalid cons (must be an array)`
            )
          } else if (review.cons.length === 0) {
            hasErrors = true
            messages.push(
              `AI review for "${review.tool || '(unnamed)'}" has no cons listed`
            )
          }

          if (!review.verdict || review.verdict.trim() === '') {
            hasErrors = true
            messages.push(
              `AI review for "${review.tool || '(unnamed)'}" is missing a verdict`
            )
          }
        }
      } else {
        hasErrors = true
        messages.push('aiReviews is not an array')
      }

      // Test 8: Validate inactiveAiTools is correctly filtered
      if (Array.isArray(aiTools) && Array.isArray(inactiveAiTools)) {
        const inactiveStatuses = new Set(['cancelled', 'unused'])
        const expectedInactive = aiTools.filter((tool) =>
          inactiveStatuses.has(tool.status)
        )

        if (inactiveAiTools.length !== expectedInactive.length) {
          hasErrors = true
          messages.push(
            `inactiveAiTools has ${inactiveAiTools.length} items but should have ${expectedInactive.length} based on cancelled/unused statuses`
          )
        }
      }

      // Test 9: Validate unique tool names
      if (Array.isArray(aiTools)) {
        const names = new Set<string>()
        const duplicates = new Set<string>()

        for (const tool of aiTools) {
          if (names.has(tool.name)) {
            duplicates.add(tool.name)
          }
          names.add(tool.name)
        }

        if (duplicates.size > 0) {
          hasErrors = true
          messages.push(
            `Duplicate tool names found: ${Array.from(duplicates).join(', ')}`
          )
        }
      }

      // Test 10: Validate URLs if present
      if (Array.isArray(aiTools)) {
        for (const tool of aiTools) {
          if ('link' in tool && tool.link) {
            try {
              new URL(tool.link)
            } catch {
              hasErrors = true
              messages.push(
                `Tool "${tool.name}" has an invalid URL in 'link' field: ${tool.link}`
              )
            }
          }

          if ('usage' in tool && tool.usage) {
            // Should be a path starting with /
            if (typeof tool.usage === 'string' && !tool.usage.startsWith('/')) {
              hasErrors = true
              messages.push(
                `Tool "${tool.name}" has an invalid usage path (should start with /): ${tool.usage}`
              )
            }
          }
        }
      }

      // Success message
      if (!hasErrors) {
        const toolCount = Array.isArray(aiTools) ? aiTools.length : 0
        const activeCount = Array.isArray(aiTools)
          ? aiTools.filter((t) =>
              ['primary', 'active', 'occasional'].includes(t.status)
            ).length
          : 0
        const inactiveCount = Array.isArray(inactiveAiTools)
          ? inactiveAiTools.length
          : 0
        const modelCount = Array.isArray(favoriteModels)
          ? favoriteModels.length
          : 0
        const reviewCount = Array.isArray(aiReviews) ? aiReviews.length : 0

        messages.push(
          `✓ Validated ${toolCount} AI tools (${activeCount} active, ${inactiveCount} inactive)`
        )
        messages.push(`✓ Validated ${modelCount} favorite models`)
        messages.push(`✓ Validated ${reviewCount} AI reviews`)
        messages.push('✓ All schema constraints satisfied')
      }
    } catch (error) {
      hasErrors = true
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      messages.push(`Failed to validate AI config: ${errorMessage}`)
    }

    return {
      id: 'ai-config-validator',
      ok: !hasErrors,
      messages
    }
  }
}

export const checks: CheckDefinition[] = [aiConfigValidator]
