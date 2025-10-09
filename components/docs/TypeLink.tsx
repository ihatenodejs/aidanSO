'use client'

import { colors, effects } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface TypeLinkProps {
  type: string
  className?: string
  availableTypeIds?: Set<string>
}

/**
 * Parses a type string and converts type references into clickable links
 * that scroll to the corresponding type definition in the documentation.
 *
 * Supports:
 * - Simple types: Domain, User, etc.
 * - Generic types: Array<Domain>, Promise<User>
 * - Union types: string | number
 * - Complex types: Record<string, Domain>
 */
export default function TypeLink({ type, className, availableTypeIds }: TypeLinkProps) {
  const parseTypeString = (typeStr: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0

    const typeNamePattern = /\b([A-Z][a-zA-Z0-9]*)\b/g
    const builtInTypes = new Set([
      'string', 'number', 'boolean', 'void', 'null', 'undefined', 'any', 'unknown',
      'never', 'object', 'symbol', 'bigint', 'Array', 'Promise', 'Record', 'Partial',
      'Required', 'Readonly', 'Pick', 'Omit', 'Exclude', 'Extract', 'NonNullable',
      'ReturnType', 'InstanceType', 'ThisType', 'Parameters', 'ConstructorParameters',
      'Date', 'Error', 'RegExp', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Function',
      'ReadonlyArray', 'String', 'Number', 'Boolean', 'Symbol', 'Object'
    ])

    let match: RegExpExecArray | null

    while ((match = typeNamePattern.exec(typeStr)) !== null) {
      const typeName = match[1]
      const matchStart = match.index
      const matchEnd = typeNamePattern.lastIndex

      if (matchStart > currentIndex) {
        parts.push(
          <span key={`text-${currentIndex}`}>
            {typeStr.substring(currentIndex, matchStart)}
          </span>
        )
      }

      if (builtInTypes.has(typeName)) {
        parts.push(
          <span key={`builtin-${matchStart}`}>
            {typeName}
          </span>
        )
      } else {
        // Check if this type exists in the documentation
        const typeExists = availableTypeIds?.has(typeName) ?? false

        if (typeExists) {
          parts.push(
            <button
              key={`link-${matchStart}`}
              onClick={(e) => {
                e.preventDefault()
                const targetId = typeName
                const element = document.getElementById(targetId)

                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })

                  element.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2', 'ring-offset-gray-900')
                  setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2', 'ring-offset-gray-900')
                  }, 2000)
                }
              }}
              className={cn(
                'hover:underline cursor-pointer',
                effects.transitions.colors
              )}
              style={{
                color: colors.accents.link,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accents.linkHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.accents.link
              }}
            >
              {typeName}
            </button>
          )
        } else {
          // Type doesn't exist in docs, render as plain text
          parts.push(
            <span key={`text-${matchStart}`}>
              {typeName}
            </span>
          )
        }
      }

      currentIndex = matchEnd
    }

    if (currentIndex < typeStr.length) {
      parts.push(
        <span key={`text-${currentIndex}`}>
          {typeStr.substring(currentIndex)}
        </span>
      )
    }

    return parts
  }

  return (
    <span className={cn('font-mono', className)}>
      {parseTypeString(type)}
    </span>
  )
}