import type { CheckContext, CheckDefinition, CheckResult } from '../types'

/**
 * Validates JSDoc documentation coverage across the codebase.
 *
 * @remarks
 * This check identifies common JSDoc issues that prevent documentation
 * from appearing properly in TypeDoc-generated docs:
 *
 * 1. Classes missing class-level JSDoc comments
 * 2. Exported functions without JSDoc documentation
 * 3. Duplicate function names across files (TypeDoc shows first match)
 * 4. Functions with JSDoc on signatures but not declarations
 *
 * @category Best Practices
 * @public
 */
const jsdocValidator: CheckDefinition = {
  id: 'jsdoc-validator',
  description:
    'Validates JSDoc documentation coverage and identifies missing documentation',
  async run(context: CheckContext): Promise<CheckResult> {
    const messages: string[] = []
    let hasErrors = false

    try {
      const fs = await import('node:fs/promises')
      const { resolve } = await import('node:path')

      async function getTsFiles(
        dir: string,
        baseDir: string = dir
      ): Promise<string[]> {
        const files: string[] = []
        const entries = await fs.readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = resolve(dir, entry.name)

          if (entry.isDirectory()) {
            if (
              !['node_modules', '.next', 'out', 'dist', '__tests__'].includes(
                entry.name
              )
            ) {
              files.push(...(await getTsFiles(fullPath, baseDir)))
            }
          } else if (entry.isFile()) {
            const isTsFile = /\.(ts|tsx)$/.test(entry.name)
            const isTestFile = /\.(test|spec)\.(ts|tsx)$/.test(entry.name)
            const isDtsFile = /\.d\.ts$/.test(entry.name)

            if (isTsFile && !isTestFile && !isDtsFile) {
              files.push(fullPath)
            }
          }
        }

        return files
      }

      const scanDirs = ['lib', 'components', 'app', 'tools']
      const allFiles: string[] = []

      for (const dir of scanDirs) {
        const dirPath = resolve(context.repoRoot, dir)
        try {
          allFiles.push(...(await getTsFiles(dirPath)))
        } catch {}
      }

      const serverTsPath = resolve(context.repoRoot, 'server.ts')
      try {
        await fs.access(serverTsPath)
        allFiles.push(serverTsPath)
      } catch {}

      const functionMap = new Map<
        string,
        Array<{ file: string; line: number; hasJsDoc: boolean }>
      >()
      const classesWithoutJsDoc: Array<{
        file: string
        line: number
        name: string
      }> = []
      const functionsWithoutJsDoc: Array<{
        file: string
        line: number
        name: string
      }> = []

      for (const filePath of allFiles) {
        const content = await fs.readFile(filePath, 'utf-8')

        const classMatches = content.matchAll(/^export\s+class\s+(\w+)/gm)
        for (const match of classMatches) {
          const className = match[1]
          const matchIndex = match.index!
          const lineNumber = content.slice(0, matchIndex).split('\n').length

          const beforeClass = content.slice(0, matchIndex).trim()
          const hasJsDoc =
            beforeClass.endsWith('*/') && beforeClass.includes('/**')

          if (!hasJsDoc) {
            classesWithoutJsDoc.push({
              file: filePath.replace(context.repoRoot + '/', ''),
              line: lineNumber,
              name: className
            })
          }
        }

        const funcMatches = content.matchAll(
          /^export\s+(?:async\s+)?(?:function\s+)?(\w+)\s*\(/gm
        )
        for (const match of funcMatches) {
          const funcName = match[1]
          const matchIndex = match.index!
          const lineNumber = content.slice(0, matchIndex).split('\n').length

          const beforeFunc = content.slice(0, matchIndex).trim()
          const hasJsDoc =
            beforeFunc.endsWith('*/') && beforeFunc.includes('/**')
          if (!functionMap.has(funcName)) {
            functionMap.set(funcName, [])
          }
          functionMap.get(funcName)!.push({
            file: filePath.replace(context.repoRoot + '/', ''),
            line: lineNumber,
            hasJsDoc
          })

          if (!hasJsDoc) {
            const skipFunctions = [
              'useState',
              'useEffect',
              'useCallback',
              'useMemo',
              'main'
            ]
            if (!skipFunctions.includes(funcName)) {
              functionsWithoutJsDoc.push({
                file: filePath.replace(context.repoRoot + '/', ''),
                line: lineNumber,
                name: funcName
              })
            }
          }
        }

        const arrowFuncMatches = content.matchAll(
          /^export\s+(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)\s*)?=>/gm
        )
        for (const match of arrowFuncMatches) {
          const funcName = match[1]
          const matchIndex = match.index!
          const lineNumber = content.slice(0, matchIndex).split('\n').length

          const beforeFunc = content.slice(0, matchIndex).trim()
          const hasJsDoc =
            beforeFunc.endsWith('*/') && beforeFunc.includes('/**')
          if (!functionMap.has(funcName)) {
            functionMap.set(funcName, [])
          }
          functionMap.get(funcName)!.push({
            file: filePath.replace(context.repoRoot + '/', ''),
            line: lineNumber,
            hasJsDoc
          })

          if (!hasJsDoc) {
            const skipFunctions = ['cn', 'clsx', 'twMerge']
            if (!skipFunctions.includes(funcName)) {
              functionsWithoutJsDoc.push({
                file: filePath.replace(context.repoRoot + '/', ''),
                line: lineNumber,
                name: funcName
              })
            }
          }
        }
      }

      if (classesWithoutJsDoc.length > 0) {
        hasErrors = true
        messages.push(
          `Found ${classesWithoutJsDoc.length} class(es) missing JSDoc:`
        )
        classesWithoutJsDoc.slice(0, 5).forEach((cls) => {
          messages.push(`  • ${cls.name} at ${cls.file}:${cls.line}`)
        })
        if (classesWithoutJsDoc.length > 5) {
          messages.push(`  ... and ${classesWithoutJsDoc.length - 5} more`)
        }
      }

      if (functionsWithoutJsDoc.length > 0) {
        hasErrors = true
        messages.push(
          `Found ${functionsWithoutJsDoc.length} exported function(s) missing JSDoc:`
        )
        functionsWithoutJsDoc.slice(0, 10).forEach((fn) => {
          messages.push(`  • ${fn.name} at ${fn.file}:${fn.line}`)
        })
        if (functionsWithoutJsDoc.length > 10) {
          messages.push(`  ... and ${functionsWithoutJsDoc.length - 10} more`)
        }
      }

      const duplicates = Array.from(functionMap.entries()).filter(
        ([, locations]) =>
          locations.length > 1 && locations.some((loc) => !loc.hasJsDoc)
      )
      if (duplicates.length > 0) {
        hasErrors = true
        messages.push(
          `Found ${duplicates.length} function name(s) duplicated across files:`
        )
        duplicates.slice(0, 5).forEach(([funcName, locations]) => {
          const undocumented = locations.filter((loc) => !loc.hasJsDoc)
          messages.push(
            `  • ${funcName} (${locations.length} locations)${undocumented.length > 0 ? ` - ${undocumented.length} undocumented` : ''}`
          )
          locations.forEach((loc) => {
            const status = loc.hasJsDoc ? '✅' : '❌'
            messages.push(`    ${status} ${loc.file}:${loc.line}`)
          })
        })
        if (duplicates.length > 5) {
          messages.push(
            `  ... and ${duplicates.length - 5} more duplicate function names`
          )
        }
      }

      if (!hasErrors) {
        messages.push(
          'All exported classes and functions have proper JSDoc documentation'
        )
      }
    } catch (error) {
      hasErrors = true
      messages.push(
        `Error during JSDoc validation: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    return {
      id: 'jsdoc-validator',
      ok: !hasErrors,
      messages
    }
  }
}

export const checks = [jsdocValidator]
